import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'



import userRoutes from './routes/users'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'
import adminRoutes from './routes/admin'
import cartRoutes from './routes/cart'
import paymentRoutes from './routes/payment'
import recipesRoutes from './routes/recipes'
import inquiriesRoutes from './routes/inquiries'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ─── Logging ───────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

// ─── Security Headers ──────────────────────────────────────────────────────
app.use(helmet())
app.use(compression()) // Compress responses



// ─── Rate Limiting ─────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // max 200 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,                   // stricter limit for auth-adjacent routes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

app.use(globalLimiter)

// ─── CORS ──────────────────────────────────────────────────────────────────
// Relaxed CORS for dev to allow testing from mobile/multiple hostnames
app.use(cors({
  origin: (origin, callback) => {
    // In dev, allow all to stop preflight "Failed to fetch" errors.
    // Replace with explicit list in production.
    if (!origin || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      const allowed = [process.env.CORS_ORIGIN || 'http://localhost:5173']
      if (allowed.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('CORS blocked: ' + origin))
      }
    }
  },
  credentials: true,
}))

// Capture raw body for Razorpay webhook signature verification
app.use(express.json({
  limit: '1mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf
  },
}))
app.use(express.urlencoded({ extended: true }))

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/users', strictLimiter, userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/recipes', recipesRoutes)
app.use('/api/inquiries', inquiriesRoutes)

// ─── 404 Handler ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Global Error Handler ─────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const isPrismaError = err?.code && err?.clientVersion
  console.error('[Error]: ', isPrismaError ? `Prisma Error: ${err.code}` : err.message)

  // Never expose stack traces to clients in production
  res.status(err.status || 500).json({ error: 'Internal server error' })
})


// ─── Start Server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Makhana API running at http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🗄️  Database:    ${process.env.DATABASE_URL?.split('@')[1] || 'local'}`)
  console.log(`✅ Health:      http://localhost:${PORT}/health\n`)
})

export default app
