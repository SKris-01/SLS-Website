import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

// NOTE: Order creation is handled via /api/payment/create-order (Razorpay only).
// COD route removed — all orders require online payment.

// GET /api/orders — Get all orders for logged-in user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { page = '1', limit = '10' } = req.query

  const skip = (parseInt(page as string) - 1) * Math.min(parseInt(limit as string) || 10, 50)
  const take = Math.min(parseInt(limit as string) || 10, 50)

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        include: {
          items: { include: { product: { select: { name: true, imageUrl: true } } } },
          address: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.order.count({ where: { userId: user.id } }),
    ])

    res.json({ orders, total, page: parseInt(page as string), pages: Math.ceil(total / take) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// GET /api/orders/:id — Get single order
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const id = req.params.id as string

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const order = await prisma.order.findFirst({
      where: { id, userId: user.id },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    })

    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// PATCH /api/orders/:id/cancel — Cancel a pending order
router.patch('/:id/cancel', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const id = req.params.id as string

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const order = await prisma.order.findFirst({ where: { id, userId: user.id } })
    if (!order) return res.status(404).json({ error: 'Order not found' })

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        // Also mark payment as FAILED for PENDING orders (no payment was captured)
        ...(order.status === 'PENDING' ? { paymentStatus: 'FAILED' } : {}),
      },
    })
    res.json({ success: true, order: updatedOrder })
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' })
  }
})

export default router
