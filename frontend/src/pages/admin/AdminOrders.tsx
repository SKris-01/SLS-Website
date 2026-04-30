import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  MapPin,
  Mail,
  X,
  CheckCircle,
  AlertTriangle,
  Eye,
  ShoppingBag,
  Filter,
  Clock,
  Package,
  Loader2,
  Phone,
  CreditCard,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react'

const OrderDetailsModal = ({ order, onClose, onUpdateStatus, isUpdating }: { order: any, onClose: () => void, onUpdateStatus: (id: string, s: string) => void, isUpdating: boolean }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
       <div className="bg-white rounded shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
          <header className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
             <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                   Order Details
                   <span className="text-sm font-normal text-gray-400">#{order.id.toUpperCase()}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
             </button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
             {/* Top Summary Row */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <select 
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className={`w-full bg-transparent font-bold text-gray-900 outline-none cursor-pointer ${isUpdating ? 'opacity-50' : ''}`}
                    >
                        {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                    <p className="font-bold text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        {order.paymentMethod}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Status</p>
                    <p className={`font-bold inline-flex items-center gap-1.5 ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'}`}>
                        {order.paymentStatus === 'PAID' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {order.paymentStatus}
                    </p>
                </div>
                <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 text-white">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Total</p>
                    <p className="text-xl font-bold">₹{order.total}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Customer & Shipping */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Customer Information
                        </h4>
                        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-1">
                            <p className="font-bold text-gray-900 text-lg">{order.user?.name || 'Walk-in Customer'}</p>
                            <p className="text-gray-500 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> {order.user?.email || 'No email provided'}
                            </p>
                            {order.address?.phone && (
                                <p className="text-gray-900 font-semibold flex items-center gap-2 mt-2">
                                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                                    {order.address.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Delivery Address
                        </h4>
                        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                            {order.address ? (
                                <div className="space-y-1 text-gray-700">
                                    <p className="font-bold text-gray-900">{order.address.firstName} {order.address.lastName}</p>
                                    <p>{order.address.line1}</p>
                                    {order.address.line2 && <p>{order.address.line2}</p>}
                                    <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                                    <p className="pt-2 text-xs font-bold text-gray-400">{order.address.phone}</p>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">Store Pickup / Digital Order</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Package className="w-4 h-4" /> Ordered Items ({order.items?.length || 0})
                    </h4>
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                    <img src={item.product?.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-5 bg-gray-50 space-y-2 border-t border-gray-100 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal || order.total}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Fees</span>
                                <span>₹{order.shippingCost || 0}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Discounts</span>
                                <span className="text-green-600">-₹{order.discount || 0}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900 text-lg">
                                <span>Grand Total</span>
                                <span>₹{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* System Info */}
             <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Reference</p>
                    <p className="font-mono text-xs text-gray-500 bg-gray-50 p-3 rounded">
                        RPay Order: {order.razorpayOrderId || 'N/A'}<br/>
                        RPay Payment: {order.razorpayPaymentId || 'N/A'}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrative Notes</p>
                    <p className="text-xs text-gray-500 italic p-3 border border-dashed border-gray-200 rounded">
                        {order.notes || 'No notes added for this order.'}
                    </p>
                </div>
             </div>
          </div>

          <footer className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
             <button onClick={onClose} className="bg-gray-900 text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-all">
                Close Details
             </button>
          </footer>
       </div>
    </div>
  )
}

const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-6 py-4 rounded shadow-2xl animate-in slide-in-from-right-full duration-300
      ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

const AdminOrders = () => {
  const { getToken } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  
  // Pagination & Date Filters
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const data = await api(`/api/admin/orders?status=${statusFilter}&page=${currentPage}&startDate=${startDate}&endDate=${endDate}`, { token })
      setOrders(data.orders || [])
      setTotalPages(data.pages || 1)
    } catch {
      // not available
    } finally {
      setLoading(false)
    }
  }, [getToken, statusFilter, currentPage, startDate, endDate])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const token = await getToken()
      await api(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        token,
        body: { status },
      })
      showNotification(`Order status updated to ${status}`)
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev: any) => ({ ...prev, status }))
      }
      fetchOrders()
    } catch (err: any) {
      showNotification(err.message || 'Failed to update order status', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700'
      case 'SHIPPED':   return 'bg-blue-100 text-blue-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      case 'PENDING':   return 'bg-yellow-100 text-yellow-700'
      default:          return 'bg-gray-100 text-gray-700'
    }
  }

  const filtered = orders.filter(o => 
    !search || 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onUpdateStatus={handleUpdateStatus} 
        isUpdating={updating === selectedOrder?.id}
      />
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
               <p className="text-sm text-gray-500">View and update customer orders.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
               <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    placeholder="Search orders..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm outline-none focus:border-gray-900 w-full sm:w-64"
                  />
               </div>
               
               <select
                 value={statusFilter}
                 onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                 className="bg-white border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-gray-900"
               >
                  <option value="">All Statuses</option>
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
               </select>

               <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <input 
                    type="date"
                    value={startDate}
                    onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
                    className="py-2 text-sm outline-none bg-transparent"
                  />
                  <span className="text-gray-400">to</span>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }}
                    className="py-2 text-sm outline-none bg-transparent"
                  />
                  {(startDate || endDate) && (
                    <button 
                      onClick={() => { setStartDate(''); setEndDate(''); setCurrentPage(1); }}
                      className="ml-2 text-gray-400 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
               </div>
            </div>
         </div>

         {loading ? (
            <div className="py-20 flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-20 bg-white border border-gray-200 rounded text-center">
               <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-500">No orders found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filtered.map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="bg-white border border-gray-200 rounded shadow-sm hover:border-gray-900 transition-all cursor-pointer group flex flex-col"
                  >
                     <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                            <span className="font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>
                     </div>

                     <div className="px-5 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[11px] font-medium text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          <span className="mx-1 text-gray-300">•</span>
                          {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>

                     <div className="p-5 flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center border border-gray-100">
                                <Mail className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{order.user?.name || 'Customer'}</p>
                                <p className="text-xs text-gray-500 truncate">{order.user?.email}</p>
                                {order.address?.phone && <p className="text-[10px] font-bold text-blue-600 mt-0.5">{order.address.phone}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center border border-gray-100">
                                <Package className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-xs font-semibold text-gray-600">{order.items?.length || 0} items ordered</p>
                        </div>
                     </div>

                     <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total</p>
                            <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
                        </div>
                        <div className="p-2 rounded bg-white border border-gray-200 text-gray-400 group-hover:text-gray-900 group-hover:border-gray-900 transition-all">
                            {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Pagination Controls */}
         {!loading && filtered.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
               <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 transition-all"
               >
                  <ChevronLeft className="w-5 h-5" />
               </button>
               
               <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                     <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded font-bold text-sm transition-all
                           ${currentPage === page 
                              ? 'bg-gray-900 text-white shadow-lg' 
                              : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-900'}`}
                     >
                        {page}
                     </button>
                  ))}
               </div>

               <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 transition-all"
               >
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
         )}
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
