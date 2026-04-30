import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/react'
import { api } from '../lib/api'

export function useAdmin() {
  const { isSignedIn, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAdmin = async () => {
      if (!isLoaded) return
      
      if (!isSignedIn) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const token = await getToken()
        const user = await api('/api/users/me', { token })
        setIsAdmin(user.role === 'admin')
      } catch (err) {
        console.error('Failed to fetch user role:', err)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [isLoaded, isSignedIn, getToken])

  return { isAdmin, loading }
}
