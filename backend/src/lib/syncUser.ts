import { prisma } from './prisma'

/**
 * Sync a Clerk user into our PostgreSQL database.
 * - If user exists → update name/email/image
 * - If user is new → create; first user in DB becomes "admin"
 */
export default async function syncCurrentUser(clerkData: {
  clerkUserId: string
  email: string
  firstName?: string | null
  lastName?: string | null
  image?: string | null
}) {
  try {
    const { clerkUserId, email, firstName, lastName, image } = clerkData

    if (!email) {
      throw new Error('User email not found')
    }

    const name = `${firstName || ''} ${lastName || ''}`.trim()

    // Check if user already exists in DB
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId },
    })

    if (dbUser) {
      // Update existing user
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { email, name, image },
      })
    } else {
      // Check if this is the first user — make them Admin
      const userCount = await prisma.user.count()
      const isFirstUser = userCount === 0

      dbUser = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          name,
          image,
          role: isFirstUser ? 'admin' : 'user',
        },
      })

      console.log(`New user created: ${email} with role: ${dbUser.role}`)
    }

    return dbUser
  } catch (error) {
    console.error('Error syncing user from Clerk:', error)
    throw error
  }
}
