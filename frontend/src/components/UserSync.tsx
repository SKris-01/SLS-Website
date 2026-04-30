import { useEffect, useRef } from 'react'
import { useUser, useAuth } from "@clerk/react"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Invisible component that syncs the Clerk user to our PostgreSQL database.
 * Place this inside <ClerkProvider> — it runs automatically after sign-in.
 */
const UserSync = () => {
  const { isSignedIn, user } = useUser()
  const { getToken } = useAuth()
  const synced = useRef(false)

  useEffect(() => {
    if (!isSignedIn || !user || synced.current) return

    const syncUser = async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_URL}/api/users/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.imageUrl,
          }),
        })

        if (res.ok) {
          synced.current = true
          console.log('✅ User synced to database')
        } else {
          console.error('❌ User sync failed:', await res.text())
        }
      } catch (err) {
        console.error('❌ User sync error:', err)
      }
    }

    syncUser()
  }, [isSignedIn, user, getToken])

  return null // invisible component
}

export default UserSync
