import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/react'
import { useQuery } from '@tanstack/react-query'
import { 
  Package, MapPin, CreditCard, Clock, ChevronLeft, 
  CheckCircle2, AlertCircle, Truck, Receipt, 
  Hash, Loader2, ShoppingBag
} from 'lucide-react'

import { api } from '../lib/api'
import Invoice from '../components/Invoice'


interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  productId: string
  product: {
    name: string
    imageUrl: string
  }
}

interface Address {
  label: string
  line1: string
  line2: string | null
  city: string
  state: string
  zip: string
}

interface Order {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  paymentMethod: string
  total: number
  subtotal: number
  discount: number
  shippingCost: number
  notes: string | null
  createdAt: string
  updatedAt: string
  address: Address | null
  items: OrderItem[]
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { user } = useUser()

  const { data: order, isLoading, isError, error } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
        const token = await getToken()
        return api(`/api/orders/${id}`, { token })
    },
    enabled: !!id,
  })

  const getStatusInfo = (status: string) => {
    const steps = [
      { id: 'PENDING', label: 'Ordered', icon: ShoppingBag, color: 'text-gray-400', bg: 'bg-gray-100' },
      { id: 'PROCESSING', label: 'Processing', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
      { id: 'SHIPPED', label: 'Shipped', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
      { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    ]

    const currentIndex = steps.findIndex(s => s.id === status)
    const activeSteps = currentIndex === -1 ? [] : steps.slice(0, currentIndex + 1)
    
    return { steps, currentIndex, activeSteps }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'DELIVERED': return "Your order has been delivered. Enjoy your snacks!"
      case 'CANCELLED': return "This order was cancelled."
      case 'SHIPPED': return "Your package is on its way to you!"
      case 'PROCESSING': return "We're currently preparing your order with care."
      case 'PENDING': return "Waiting for payment confirmation."
      default: return "We're working on your order."
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#f8f9fa]">
        <Loader2 className="w-10 h-10 text-brand-red/30 animate-spin" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center bg-[#f8f9fa]">
        <div className="bg-white border border-gray-100 p-8 rounded-[40px] max-w-md w-full shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase mb-2">Order Not Found</h2>
          <p className="text-gray-500 text-sm mb-8">{(error as any)?.message || "We couldn't find the order you're looking for."}</p>
          <button 
            onClick={() => navigate('/profile')} 
            className="w-full bg-brand-dark hover:bg-brand-red text-white py-4 rounded-full font-bold uppercase tracking-widest transition-all"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const { steps, currentIndex } = getStatusInfo(order.status)

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-12 px-4 md:px-6 bg-[#fafafa]">
      <div className="w-full max-w-5xl mx-auto">
        {/* Simple Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1.5 text-gray-400 hover:text-brand-red transition-colors mb-2 md:mb-3"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-bold uppercase text-[9px] tracking-wider">Back to Orders</span>
            </button>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
              Hey, {user?.firstName || 'Friend'}!
            </h1>
            <p className="text-gray-500 text-[11px] md:text-xs mt-1">
              Order <span className="text-brand-red font-bold">#{order.id.slice(0, 8).toUpperCase()}</span> • {getStatusMessage(order.status)}
            </p>
          </div>
          <div className="flex gap-4 text-[9px] md:text-[10px] text-gray-400 uppercase font-bold border-l-2 border-gray-100 pl-4 h-fit md:mb-1">
            <div>
              <p className="mb-0.5 opacity-60">Placed On</p>
              <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 flex flex-col gap-4 md:gap-5">
            
            {/* Simple Progress Tracker */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 overflow-x-auto scrollbar-hide">
              <div className="flex justify-between relative min-w-[300px] md:min-w-0">
                <div className="absolute top-[1.125rem] left-0 w-full h-0.5 bg-gray-50 -z-0" />
                <div 
                  className="absolute top-[1.125rem] left-0 h-0.5 bg-brand-red transition-all duration-700 -z-0" 
                  style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                />
                
                {steps.map((step, idx) => {
                  const Icon = step.icon
                  const isActive = idx <= currentIndex
                  
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center transition-all border
                        ${isActive ? 'bg-brand-red border-brand-red text-white shadow-md shadow-brand-red/10' : 'bg-white border-gray-100 text-gray-300'}`}>
                        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-wide whitespace-nowrap ${isActive ? 'text-brand-dark' : 'text-gray-300'}`}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 md:mb-6 border-b border-gray-50 pb-3 md:pb-4">
                <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-red" />
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-tight text-gray-900">Your Items</h2>
              </div>
              
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg md:rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-100">
                      <img 
                        src={item.product?.imageUrl || '/placeholder.png'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.productId}`} className="text-gray-900 font-bold text-xs md:text-sm hover:text-brand-red transition-colors block truncate">
                        {item.product?.name || item.name}
                      </Link>
                      <p className="text-gray-400 text-[9px] md:text-[10px] mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-bold text-xs md:text-sm italic">₹{item.price * item.quantity}</p>
                      <p className="text-gray-400 text-[8px] md:text-[9px] uppercase tracking-wider">₹{item.price}/pc</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Details Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-red" />
                  <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-tight text-gray-900 border-b-2 border-brand-red pb-0.5 h-fit">Shipping Address</h3>
                </div>
                {order.address ? (
                  <div className="text-gray-600 text-[12px] md:text-[13px] space-y-1">
                    <p className="text-brand-red font-bold text-[9px] md:text-[10px] uppercase mb-1">{order.address.label}</p>
                    <p>{order.address.line1}</p>
                    {order.address.line2 && <p>{order.address.line2}</p>}
                    <p className="font-bold text-gray-900">{order.address.city}, {order.address.state} {order.address.zip}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-[11px] italic">Not available</p>
                )}
              </div>

              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-red" />
                  <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-tight text-gray-900 border-b-2 border-brand-red pb-0.5 h-fit">Payment Details</h3>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider">Method</span>
                    <span className="text-gray-900 font-bold text-[11px] md:text-xs uppercase">{order.paymentMethod === 'ONLINE' ? 'Razorpay' : order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
                      <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      <span className="text-gray-900 font-bold uppercase text-[9px] tracking-tighter">{order.paymentStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-5 h-fit">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/[0.03] rounded-full -mr-10 -mt-10" />
              
              <div className="flex items-center gap-2 mb-6">
                <Receipt className="w-4 h-4 text-brand-red" />
                <h3 className="font-bold uppercase tracking-tight text-sm italic">Order Summary</h3>
              </div>
              
              <div className="space-y-3 text-xs mb-6 pb-6 border-b border-gray-50">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span className="font-bold uppercase text-[9px]">Discount</span>
                  <span className="font-bold">- ₹{order.discount}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Total</span>
                <span className="text-3xl font-black italic tracking-tighter text-brand-red">₹{order.total}</span>
              </div>

              <button 
                onClick={() => window.print()}
                className="w-full bg-brand-dark hover:bg-brand-red text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-dark/5"
              >
                <Hash className="w-3 h-3" />
                Get PDF Invoice
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="text-gray-900 font-bold uppercase tracking-tight text-xs mb-2">Need Help?</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed mb-4 font-medium">Have a question? Our support buddies are here for you.</p>
              <a href="mailto:support@shriyans.com" className="block w-full bg-white hover:bg-gray-100 text-gray-600 p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all text-center border border-gray-100">
                Email Support
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* Printable Invoice Section */}
      <div className="hidden print-section bg-white text-black p-0">
        <Invoice order={order} />
      </div>

    </div>
  )
}

export default OrderDetails
