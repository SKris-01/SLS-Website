import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/react"
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  ShoppingBag,
  Users,
  Package,
  Calendar,
  Clock,
  PlusCircle,
  BarChart3,
  Loader2,
} from 'lucide-react'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
  recentOrders: any[]
}

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <div className="bg-white border border-gray-200 rounded p-6 shadow-sm flex items-center gap-4">
    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-500">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-normal text-gray-900">{value}</h3>
    </div>
  </div>
)

const AdminDashboard = () => {
  const { getToken } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken()
        const data = await api('/api/admin/stats', { token })
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [getToken])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Quick summary of your store's performance.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={BarChart3} label="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} />
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} />
          <StatCard icon={Users} label="Total Customers" value={stats?.totalUsers || 0} />
          <StatCard icon={Package} label="Products" value={stats?.totalProducts || 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Recent Orders
              </h3>
              <Link to="/admin/orders" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              {stats?.recentOrders?.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No orders found.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                      <th className="px-6 py-3 font-semibold">Order ID</th>
                      <th className="px-6 py-3 font-semibold">Customer</th>
                      <th className="px-6 py-3 font-semibold">Amount</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 text-right font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {stats?.recentOrders?.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-6 py-4">{order.user?.name || 'Customer'}</td>
                        <td className="px-6 py-4 font-semibold">₹{order.total}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                            ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-gray-100 text-gray-600'}`}>
                                {order.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
               <div className="space-y-3">
                 <Link to="/admin/products" className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-2 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
                    <PlusCircle className="w-4 h-4" />
                    Manage Inventory
                 </Link>
                 <Link to="/admin/orders" className="flex items-center justify-center gap-2 w-full border border-gray-200 py-2 rounded text-sm font-semibold hover:bg-gray-50 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                    Review Orders
                 </Link>
               </div>
            </div>

            <div className="bg-gray-900 rounded p-6 text-white shadow-lg overflow-hidden relative">
                <h3 className="text-lg font-bold mb-1">System Status</h3>
                <p className="text-xs text-gray-400 mb-6">Real-time health monitor</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold tracking-wider">SYSTEMS OPERATIONAL</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
