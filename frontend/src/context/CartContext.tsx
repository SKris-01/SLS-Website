import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth, useUser } from "@clerk/react"
import { api } from '../lib/api'

interface CartItem {
  id: string           // CartItem DB id (for logged-in) or local id
  productId: string
  name: string
  currentPrice: string
  image: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  loading: boolean
  addToCart: (product: any) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, delta: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const GUEST_CART_KEY = 'makhana_guest_cart'

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useUser()
  const { getToken } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [synced, setSynced] = useState(false)

  // Load cart — from API if signed in, from localStorage if guest
  const loadCart = useCallback(async () => {
    if (isSignedIn) {
      setLoading(true)
      try {
        const token = await getToken()

        // Merge any guest cart items into the DB before loading
        const localRaw = localStorage.getItem(GUEST_CART_KEY)
        if (localRaw) {
          try {
            const localItems: CartItem[] = JSON.parse(localRaw)
            if (localItems.length > 0) {
              await Promise.allSettled(
                localItems.map(item =>
                  api('/api/cart', {
                    method: 'POST',
                    token,
                    body: { productId: item.productId, quantity: item.quantity },
                  })
                )
              )
            }
          } catch { /* ignore merge errors */ }
          localStorage.removeItem(GUEST_CART_KEY)
        }

        const data = await api('/api/cart', { token })
        const items: CartItem[] = (data || []).map((item: any) => ({
          id: item.id,
          productId: item.productId,
          name: item.product?.name || '',
          currentPrice: String(item.product?.price || 0),
          image: item.product?.imageUrl || '',
          quantity: item.quantity,
        }))
        setCart(items)
        setSynced(true)
      } catch {
        // If user not in DB yet, fall back to localStorage
        const local = localStorage.getItem(GUEST_CART_KEY)
        if (local) setCart(JSON.parse(local))
      } finally {
        setLoading(false)
      }
    } else {
      // Guest — load from localStorage
      try {
        const local = localStorage.getItem(GUEST_CART_KEY)
        if (local) setCart(JSON.parse(local))
      } catch { /* ignore */ }
    }
  }, [isSignedIn, getToken])

  useEffect(() => { loadCart() }, [loadCart])

  // Persist guest cart to localStorage
  const saveLocal = (items: CartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
  }

  // Add to cart
  const addToCart = async (product: any) => {
    const productId = product.id || product.productId

    if (isSignedIn && synced) {
      try {
        const token = await getToken()
        await api('/api/cart', {
          method: 'POST',
          token,
          body: { productId, quantity: 1 },
        })
        await loadCart() // Refresh full cart from DB
      } catch {
        // Fallback to local
        addLocal(product)
      }
    } else {
      addLocal(product)
    }
  }

  const addLocal = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === (product.id || product.productId))
      let updated: CartItem[]
      if (existing) {
        updated = prev.map(i =>
          i.productId === (product.id || product.productId)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      } else {
        updated = [...prev, {
          id: `local_${Date.now()}`,
          productId: product.id || product.productId,
          name: product.name,
          currentPrice: String(product.price || product.currentPrice),
          image: product.imageUrl || product.image,
          quantity: 1,
        }]
      }
      saveLocal(updated)
      return updated
    })
  }

  // Remove from cart
  const removeFromCart = async (itemId: string) => {
    if (isSignedIn && synced && !itemId.startsWith('local_')) {
      try {
        const token = await getToken()
        await api(`/api/cart/${itemId}`, { method: 'DELETE', token })
      } catch { /* ignore */ }
    }

    setCart(prev => {
      const updated = prev.filter(i => i.id !== itemId)
      saveLocal(updated)
      return updated
    })
  }

  // Update quantity
  const updateQuantity = async (itemId: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQty }
        }
        return item
      })
      saveLocal(updated)
      return updated
    })

    if (isSignedIn && synced && !itemId.startsWith('local_')) {
      const item = cart.find(i => i.id === itemId)
      if (item) {
        const newQty = Math.max(1, item.quantity + delta)
        try {
          const token = await getToken()
          await api(`/api/cart/${itemId}`, {
            method: 'PATCH',
            token,
            body: { quantity: newQty },
          })
        } catch { /* ignore */ }
      }
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (isSignedIn && synced) {
      try {
        const token = await getToken()
        await api('/api/cart', { method: 'DELETE', token })
      } catch { /* ignore */ }
    }
    setCart([])
    localStorage.removeItem(GUEST_CART_KEY)
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.currentPrice) * item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
