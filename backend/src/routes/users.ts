import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import syncCurrentUser from '../lib/syncUser'

const router = Router()

// POST /api/users/sync
// Called from frontend right after Clerk sign-in to create/update user in our DB
// Body: { clerkUserId, email, firstName, lastName, image }
router.post('/sync', requireAuth, async (req: Request, res: Response) => {
  const { clerkUserId, email, firstName, lastName, image } = req.body

  if (!clerkUserId || !email) {
    return res.status(400).json({ error: 'clerkUserId and email are required' })
  }

  // Extra safety: the clerkUserId from body must match the JWT token
  const tokenClerkId = (req as any).clerkId
  if (tokenClerkId && tokenClerkId !== clerkUserId) {
    return res.status(403).json({ error: 'Token/body clerkUserId mismatch' })
  }

  try {
    const user = await syncCurrentUser({ clerkUserId, email, firstName, lastName, image })
    res.json({ success: true, user })
  } catch (error) {
    console.error('User sync error:', error)
    res.status(500).json({ error: 'Failed to sync user' })
  }
})

// GET /api/users/me
// Returns the current logged-in user's DB record (auto-syncs if not yet in DB)
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const clerkId    = (req as any).clerkId
  const clerkEmail = (req as any).email

  try {
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkId },
      include: {
        addresses: { orderBy: { createdAt: 'desc' } },
        _count: { select: { orders: true, reviews: true } },
      },
    })

    // Auto-sync if user exists in Clerk but not yet in our DB
    if (!user && clerkEmail) {
      await syncCurrentUser({ clerkUserId: clerkId, email: clerkEmail })
      // Re-fetch with relations
      user = await prisma.user.findUnique({
        where: { clerkUserId: clerkId },
        include: {
          addresses: { orderBy: { createdAt: 'desc' } },
          _count: { select: { orders: true, reviews: true } },
        },
      })
    }

    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (error) {
    console.error('/me error:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// GET /api/users/addresses
router.get('/addresses', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: 'desc' },
    })
    res.json(addresses)
  } catch {
    res.status(500).json({ error: 'Failed to fetch addresses' })
  }
})

// POST /api/users/addresses
router.post('/addresses', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { label, firstName, lastName, line1, line2, city, state, zip, country, phone, isDefault } = req.body

  if (!label || !firstName || !lastName || !line1 || !city || !state || !zip || !country || !phone) {
    return res.status(400).json({ error: 'All required fields must be filled' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: { 
        userId: user.id, 
        label, 
        firstName, 
        lastName, 
        line1, 
        line2, 
        city, 
        state, 
        zip, 
        country, 
        phone, 
        isDefault: !!isDefault 
      },
    })
    res.status(201).json(address)
  } catch (error) {
    console.error('Failed to create address:', error)
    res.status(500).json({ error: 'Failed to create address' })
  }
})

// PATCH /api/users/addresses/:id/default — set as default
router.patch('/addresses/:id/default', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const id = req.params.id as string

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } })
    const address = await prisma.address.update({ where: { id }, data: { isDefault: true } })
    res.json(address)
  } catch {
    res.status(500).json({ error: 'Failed to set default address' })
  }
})

// DELETE /api/users/addresses/:id
router.delete('/addresses/:id', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const id = req.params.id as string

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const address = await prisma.address.findFirst({ where: { id, userId: user.id } })
    if (!address) return res.status(404).json({ error: 'Address not found' })

    await prisma.address.delete({ where: { id } })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete address' })
  }
})

export default router
