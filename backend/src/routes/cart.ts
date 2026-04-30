import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

// GET /api/cart — Get user's cart items with product details
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })

    res.json(cartItems)
  } catch {
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
})

// POST /api/cart — Add item to cart (or increment quantity)
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { productId, quantity = 1 } = req.body

  if (!productId) return res.status(400).json({ error: 'productId is required' })
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    return res.status(400).json({ error: 'Quantity must be an integer between 1 and 50' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return res.status(404).json({ error: 'Product not found' })

    // Upsert — if product already in cart, increment quantity
    const cartItem = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId: user.id, productId, quantity },
      include: { product: true },
    })

    res.status(201).json(cartItem)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to add to cart' })
  }
})

// PATCH /api/cart/:id — Update quantity
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const id = req.params.id as string
  const { quantity } = req.body

  if (!quantity || quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' })

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const cartItem = await prisma.cartItem.findFirst({ where: { id, userId: user.id } })
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' })

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    })

    res.json(updated)
  } catch {
    res.status(500).json({ error: 'Failed to update cart' })
  }
})

// DELETE /api/cart/:id — Remove item from cart
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const id = req.params.id as string

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const cartItem = await prisma.cartItem.findFirst({ where: { id, userId: user.id } })
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' })

    await prisma.cartItem.delete({ where: { id } })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to remove from cart' })
  }
})

// DELETE /api/cart — Clear entire cart
router.delete('/', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    await prisma.cartItem.deleteMany({ where: { userId: user.id } })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to clear cart' })
  }
})

export default router
