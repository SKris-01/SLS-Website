import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@clerk/backend'
import { prisma } from '../lib/prisma'

// ─── requireAuth ───────────────────────────────────────────────────────────
// Cryptographically verifies the Clerk JWT using CLERK_SECRET_KEY.
// Sets req.clerkId and req.email on success.
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    })

    if (!payload.sub) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' })
    }

    ;(req as any).clerkId = payload.sub
    ;(req as any).email   = (payload as any).email || ''
    next()
  } catch (error) {
    console.error('JWT Verification Error:', error)
    return res.status(401).json({ error: 'Unauthorized: Token verification failed' })
  }
}

// ─── optionalAuth ──────────────────────────────────────────────────────────
// Verifies the JWT if present but does not reject if missing or invalid.
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1]
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      })
      ;(req as any).clerkId = payload.sub
    } catch {}
  }
  next()
}

// ─── isAdmin ───────────────────────────────────────────────────────────────
// Must run AFTER requireAuth. Checks the user's role in the database.
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const clerkId = (req as any).clerkId
  if (!clerkId) return res.status(403).json({ error: 'Forbidden' })

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' })
    }
    next()
  } catch {
    return res.status(500).json({ error: 'Authorization check failed' })
  }
}
