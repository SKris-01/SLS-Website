import { PrismaClient } from '../../generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL!

// Custom pg pool for better management on VPS (8GB RAM)
// Default is usually 10, increasing based on resources.
const pool = new Pool({ 
  connectionString,
  max: 20,              // Up to 20 connections per Node instance
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 10000,
})

const adapter = new PrismaPg(pool as any)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })


if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

