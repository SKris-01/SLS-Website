import { useEffect } from 'react'
import { useAuth, useUser } from "@clerk/react"
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Package, Calendar, ChevronRight, Loader2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { api } from '../lib/api'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  product: { name: string; imageUrl: string }
}

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items: OrderItem[]
}

const Orders = () => {
  const { isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in')
    }
  }, [isLoaded, isSignedIn, navigate])

  const { data, isLoading } = useQuery<{ orders: Order[] }>({
    queryKey: ['orders'],
    queryFn: async () => {
      const token = await getToken()
      return api('/api/orders', { token })
    },
    enabled: !!isSignedIn,
  })

  const orders = (data?.orders || []).filter((o: Order) => o.status !== 'PENDING')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500 text-white border-green-200'
      case 'SHIPPED': return 'bg-primary text-white border-primary/20'
      case 'CANCELLED': return 'bg-primary/20 text-primary border-primary/10'
      case 'PROCESSING': return 'bg-secondary text-primary border-primary/5'
      default: return 'bg-secondary/20 text-primary/40'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 bg-white">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 bg-gray-50/30">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
            <Link to="/profile" className="inline-flex items-center gap-2 text-primary/40 hover:text-primary font-black uppercase text-[10px] tracking-widest mb-6 transition-all group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Profile
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-black italic text-primary mb-2">My Orders</h1>
                    <p className="text-primary/40 font-black uppercase tracking-[0.3em] text-[10px]">Your premium acquisition history</p>
                </div>
                <Link to="/products" className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                    Discover More
                </Link>
            </div>
        </div>

        {orders.length === 0 ? (
            <div className="bg-white rounded-[48px] py-32 px-12 flex flex-col items-center text-center shadow-soft border border-primary/5">
                <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-10 border border-primary/5">
                    <ShoppingBag className="w-10 h-10 text-primary/20" strokeWidth={1} />
                </div>
                <h3 className="text-primary font-serif font-black text-3xl italic mb-4">No Orders Discovered</h3>
                <p className="text-primary/30 font-black text-[10px] tracking-[0.4em] uppercase mb-12 max-w-xs">
                    Your exquisite collection awaits its first premium addition.
                </p>
                <Link to="/products" className="bg-primary text-white py-5 px-12 rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    Start Your Journey
                </Link>
            </div>
        ) : (
            <div className="space-y-6">
                {orders.map((order: Order) => (
                    <div 
                        key={order.id} 
                        onClick={() => navigate(`/profile/order/${order.id}`)}
                        className="bg-white border border-primary/5 rounded-[40px] p-6 md:p-10 flex flex-col gap-8 shadow-soft hover:shadow-2xl hover:translate-y-[-4px] transition-all cursor-pointer group overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center shrink-0 border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <Package className="w-8 h-8" strokeWidth={1.5} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h4 className="text-primary font-serif font-black italic text-xl truncate">Order #{order.id.slice(-8).toUpperCase()}</h4>
                                        <span className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full border ${getStatusColor(order.status)} tracking-widest`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-primary/30 font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-primary/40" />
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-6 md:pt-0 border-primary/5">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-primary/30 uppercase tracking-widest mb-1">Grand Total</p>
                                    <p className="text-primary font-black text-3xl italic tracking-tighter">₹{order.total}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>

                        {/* Order Preview Items */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-primary/5">
                            {order.items.map(item => (
                                <div key={item.id} className="flex items-center gap-3 bg-secondary/5 text-primary text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-2xl border border-primary/5 group-hover:bg-white transition-colors">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-primary/5 overflow-hidden shadow-sm shrink-0">
                                        <img src={item.product?.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="truncate max-w-[120px]">{item.product?.name || item.name}</span>
                                    <span className="text-primary/30 font-serif italic ml-1">×{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  )
}

export default Orders
