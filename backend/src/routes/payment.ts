import { Router, Request, Response } from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

// ─── Razorpay Instance ────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

// ─── POST /api/payment/create-order ───────────────────────────────────────
// Creates a Razorpay order from the user's cart items
router.post('/create-order', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { items, addressId, notes } = req.body

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must have at least one item' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Validate & fetch products
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

    if (products.length !== productIds.length) {
      return res.status(400).json({ error: 'One or more products not found' })
    }

    // Check stock
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) continue
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
      }
    }

    // Calculate totals (use DB prices, not client-submitted)
    const subtotal = items.reduce((sum: number, item: any) => {
      const product = products.find(p => p.id === item.productId)!
      return sum + product.price * item.quantity
    }, 0)

    const shippingCost = subtotal >= 499 ? 0 : 49
    const total = subtotal + shippingCost

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // amount in paise
      currency: 'INR',
      receipt: `order_rcpt_${Date.now()}`,
      notes: {
        userId: user.id,
        addressId: addressId || '',
        customerNotes: notes || '',
      },
    })

    // Create a PENDING order in our DB linked to the Razorpay order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId: addressId || null,
        paymentMethod: 'RAZORPAY',
        razorpayOrderId: razorpayOrder.id,
        notes,
        subtotal,
        shippingCost,
        total,
        paymentStatus: 'PENDING',
        status: 'PENDING',
        items: {
          create: items.map((item: any) => {
            const product = products.find(p => p.id === item.productId)!
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
              name: product.name,
            }
          }),
        },
      },
      include: { items: { include: { product: { select: { name: true, imageUrl: true } } } } },
    })

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Razorpay create-order error:', error)
    res.status(500).json({ error: 'Failed to create payment order' })
  }
})

// ─── POST /api/payment/verify ─────────────────────────────────────────────
// Verifies Razorpay payment signature & confirms the order
router.post('/verify', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    return res.status(400).json({ error: 'Missing payment verification data' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      // Mark order as failed
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED' },
      })
      return res.status(400).json({ error: 'Invalid payment signature' })
    }

    // Signature valid → update order
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
      include: { items: { include: { product: { select: { name: true, imageUrl: true } } } } },
    })

    if (!order) return res.status(404).json({ error: 'Order not found' })

    // Idempotency: if already confirmed (e.g. network retry), return success immediately
    if (order.status === 'CONFIRMED' && order.paymentStatus === 'PAID') {
      return res.json({ success: true, order })
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Order is not in a payable state' })
    }

    // Transaction: update order + decrement stock + clear cart
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
        include: { items: { include: { product: { select: { name: true, imageUrl: true } } } } },
      })

      // Decrement stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // Clear user's cart
      await tx.cartItem.deleteMany({ where: { userId: user.id } })

      return updated
    })

    res.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({ error: 'Payment verification failed' })
  }
})

// ─── POST /api/payment/cancel ─────────────────────────────────────────────
// Marks a pending order as CANCELLED (called when user closes modal)
router.post('/cancel', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { orderId } = req.body

  if (!orderId) return res.status(400).json({ error: 'OrderId required' })

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const order = await prisma.order.update({
      where: { id: orderId, userId: user.id, status: 'PENDING' },
      data: { status: 'CANCELLED', paymentStatus: 'FAILED' },
    })

    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' })
  }
})

// ─── POST /api/payment/webhook ────────────────────────────────────────────
// Razorpay webhook — catches payments even if user closes the browser before
// the frontend calls /verify. Configure this URL in Razorpay Dashboard →
// Settings → Webhooks: https://your-domain.com/api/payment/webhook
router.post('/webhook', async (req: Request, res: Response) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not configured')
    return res.status(500).json({ error: 'Webhook not configured' })
  }

  const signature = req.headers['x-razorpay-signature'] as string
  if (!signature) {
    return res.status(400).json({ error: 'Missing signature header' })
  }

  // Verify webhook signature using the raw body
  const rawBody = (req as any).rawBody
  if (!rawBody) {
    return res.status(400).json({ error: 'Missing raw body' })
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  if (expectedSignature !== signature) {
    console.error('Webhook signature mismatch')
    return res.status(400).json({ error: 'Invalid webhook signature' })
  }

  // Signature valid — process the event
  try {
    const event = req.body

    // We only care about successful payment capture
    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity
      if (!payment) {
        return res.json({ status: 'ignored', reason: 'No payment entity in payload' })
      }

      const razorpayOrderId = payment.order_id
      const razorpayPaymentId = payment.id

      if (!razorpayOrderId) {
        return res.json({ status: 'ignored', reason: 'No order_id in payment' })
      }

      // Find the order linked to this Razorpay order
      const order = await prisma.order.findFirst({
        where: { razorpayOrderId },
        include: { items: true },
      })

      if (!order) {
        console.warn(`Webhook: No order found for razorpayOrderId=${razorpayOrderId}`)
        return res.json({ status: 'ignored', reason: 'Order not found' })
      }

      // Idempotency: if already confirmed, skip
      if (order.paymentStatus === 'PAID' && order.status === 'CONFIRMED') {
        return res.json({ status: 'already_processed' })
      }

      // Only process PENDING orders
      if (order.status !== 'PENDING') {
        return res.json({ status: 'ignored', reason: `Order status is ${order.status}` })
      }

      // Transaction: confirm order + decrement stock + clear cart
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            razorpayPaymentId,
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
          },
        })

        // Decrement stock for each item
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        }

        // Clear user's cart
        await tx.cartItem.deleteMany({ where: { userId: order.userId } })
      })

      console.log(`Webhook: Order ${order.id} confirmed via webhook (payment ${razorpayPaymentId})`)
      return res.json({ status: 'ok', orderId: order.id })
    }

    // For other events, acknowledge but do nothing
    res.json({ status: 'ignored', event: event.event })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // Return 200 to prevent Razorpay from retrying on our internal errors
    // (we log the error and can investigate manually)
    res.json({ status: 'error', message: 'Internal processing error' })
  }
})

export default router
