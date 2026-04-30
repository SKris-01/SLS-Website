const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Makes an authenticated API call to the backend.
 * Pass the Clerk token from useAuth().getToken()
 */
export async function api(
  endpoint: string,
  options: {
    method?: string
    body?: any
    token?: string | null
  } = {}
) {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }

  return res.json()
}
