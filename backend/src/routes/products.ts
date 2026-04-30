import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { optionalAuth, requireAuth } from '../middleware/auth'

const router = Router()

// GET /api/products?category=&search=&page=&limit=
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  const { category, search, page = '1', limit = '12', tags } = req.query

  const skip = (parseInt(page as string) - 1) * Math.min(parseInt(limit as string) || 12, 50)
  const take = Math.min(parseInt(limit as string) || 12, 50)

  const where: any = { isActive: true }

  if (category) where.category = category as string
  if (search) {
    const sanitizedSearch = (search as string).slice(0, 200).trim()
    if (sanitizedSearch) {
      where.OR = [
        { name:        { contains: sanitizedSearch, mode: 'insensitive' } },
        { description: { contains: sanitizedSearch, mode: 'insensitive' } },
        { flavour:     { contains: sanitizedSearch, mode: 'insensitive' } },
      ]
    }
  }
  if (tags) {
    const tagList = (tags as string).split(',')
    where.tags = { hasSome: tagList }
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { reviews: true } } },
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      products,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / take),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/category/list — get all unique categories
// NOTE: Must be defined BEFORE /:id to prevent 'category' being captured as an ID
router.get('/category/list', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    })
    res.json(categories.map(c => c.category))
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { reviews: true } },
      },
    })

    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// POST /api/products/:id/review
router.post('/:id/review', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId

  const { rating, comment } = req.body
  const productId = req.params.id as string

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' })
  }

  try {
    // ✅ Fixed: was incorrectly using clerkId — field is clerkUserId
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Use userId+productId compound lookup via updateMany/create instead of fabricated id
    const existing = await prisma.review.findFirst({ where: { userId: user.id, productId } })
    const review = existing
      ? await prisma.review.update({ where: { id: existing.id }, data: { rating, comment } })
      : await prisma.review.create({ data: { userId: user.id, productId, rating, comment } })

    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' })
  }
})

export default router
