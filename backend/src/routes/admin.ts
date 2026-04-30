import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth, isAdmin } from '../middleware/auth'

const router = Router()

// All admin routes require a verified JWT + admin role
router.use(requireAuth, isAdmin)

// Admin: GET /api/admin/products
router.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { _count: { select: { orderItems: true, reviews: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(products)
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Admin: POST /api/admin/products
router.post('/products', async (req: Request, res: Response) => {
  const { name, description, price, mrp, imageUrl, images, category, tags, stock, weight, flavour } = req.body

  if (!name || !description || !price || !imageUrl || !category) {
    return res.status(400).json({ error: 'Missing required product fields' })
  }

  try {
    const product = await prisma.product.create({
      data: { name, description, price: Number(price), mrp: Number(mrp || price), imageUrl, images: images || [], category, tags: tags || [], stock: Number(stock || 100), weight, flavour },
    })
    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Admin: PATCH /api/admin/products/:id
router.patch('/products/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  // Whitelist only safe, updatable fields — prevents mass assignment
  const { name, description, price, mrp, stock, imageUrl, images, category, tags, weight, flavour, isActive } = req.body
  const data: Record<string, any> = {}
  if (name        !== undefined) data.name        = name
  if (description !== undefined) data.description = description
  if (price       !== undefined) data.price       = Number(price)
  if (mrp         !== undefined) data.mrp         = Number(mrp)
  if (stock       !== undefined) data.stock       = Number(stock)
  if (imageUrl    !== undefined) data.imageUrl    = imageUrl
  if (images      !== undefined) data.images      = images
  if (category    !== undefined) data.category    = category
  if (tags        !== undefined) data.tags        = tags
  if (weight      !== undefined) data.weight      = weight
  if (flavour     !== undefined) data.flavour     = flavour
  if (isActive    !== undefined) data.isActive    = isActive

  try {
    const product = await prisma.product.update({ where: { id }, data })
    res.json(product)
  } catch {
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// Admin: DELETE /api/admin/products/:id
router.delete('/products/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  try {
    // Delete related records that might block the deletion
    await prisma.cartItem.deleteMany({ where: { productId: id } })
    await prisma.review.deleteMany({ where: { productId: id } })
    
    // Attempt to delete the product
    await prisma.product.delete({ where: { id } })
    res.json({ success: true })
  } catch (error: any) {
    console.error('Delete error:', error)
    if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Cannot delete product that has been ordered. Try archiving instead.' })
    }
    res.status(500).json({ error: 'Failed to delete product permanently' })
  }
})

// Admin: GET /api/admin/orders
router.get('/orders', async (req: Request, res: Response) => {
  const { status, page = '1', limit = '20', startDate, endDate } = req.query
  const skip = (parseInt(page as string) - 1) * Math.min(parseInt(limit as string) || 20, 100)
  const take = Math.min(parseInt(limit as string) || 20, 100)

  const where: any = {}
  if (status) where.status = status

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = new Date(startDate as string)
    if (endDate) {
      // Set to end of the day if just a date string is provided
      const end = new Date(endDate as string)
      if (endDate.toString().length <= 10) end.setHours(23, 59, 59, 999)
      where.createdAt.lte = end
    }
  }

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true, imageUrl: true } } } },
          address: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.order.count({ where }),
    ])
    res.json({ orders, total, page: parseInt(page as string), pages: Math.ceil(total / take) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Admin: PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', async (req: Request, res: Response) => {
  const id = req.params.id as string
  const { status } = req.body

  const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  try {
    const order = await prisma.order.update({ where: { id }, data: { status } })
    res.json(order)
  } catch {
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

// Admin: GET /api/admin/stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { 
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true, imageUrl: true } } } } 
        },
      }),
    ])

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalUsers,
      totalProducts,
      recentOrders,
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Admin: GET /api/admin/users
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: { select: { orders: true, reviews: true } }
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  } catch (err) {
    console.error('Fetch users error:', err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Admin: GET /api/admin/inquiries
router.get('/inquiries', async (_req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(inquiries)
  } catch {
    res.status(500).json({ error: 'Failed to fetch inquiries' })
  }
})

// Admin: PATCH /api/admin/inquiries/:id
router.patch('/inquiries/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  const { status } = req.body

  const validStatuses = ['NEW', 'READ', 'REPLIED']
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` })
  }

  try {
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status: status as string },
    })
    res.json(inquiry)
  } catch {
    res.status(500).json({ error: 'Failed to update inquiry' })
  }
})

// Admin: DELETE /api/admin/inquiries/:id
router.delete('/inquiries/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string
  try {
    await prisma.inquiry.delete({ where: { id } })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete inquiry' })
  }
})

export default router

