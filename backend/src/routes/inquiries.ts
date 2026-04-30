import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// Public: POST /api/inquiries
router.post('/', async (req: Request, res: Response) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide all required fields (name, email, message)' })
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: { name, email, message },
    })
    res.status(201).json({ success: true, inquiry })
  } catch (error) {
    console.error('Inquiry creation error:', error)
    res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }
})

export default router
