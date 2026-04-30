import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  Users,
  Search,
  Mail,
  Calendar,
  Shield,
  Loader2,
} from 'lucide-react'

const AdminUsers = () => {
  const { getToken } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/admin/users', { token })
      setUsers(data)
    } catch {
      // API not available
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const filtered = users.filter(u => 
    !search || 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Directory</h1>
            <p className="text-sm text-gray-500">Manage and view registered customers.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm outline-none focus:border-gray-900 w-full sm:w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 bg-white border border-gray-200 rounded text-center">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold uppercase text-xs">Customer</th>
                            <th className="px-6 py-4 font-semibold uppercase text-xs">Email</th>
                            <th className="px-6 py-4 font-semibold uppercase text-xs">Stats</th>
                            <th className="px-6 py-4 font-semibold uppercase text-xs text-right">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filtered.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                            {user.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name || 'Anonymous'}</p>
                                            {user.role === 'admin' && (
                                              <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                                                <Shield className="w-2 h-2" /> Admin
                                              </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-4 text-xs">
                                        <span className="text-gray-500">Orders: <b className="text-gray-900">{user._count?.orders || 0}</b></span>
                                        <span className="text-gray-500">Reviews: <b className="text-gray-900">{user._count?.reviews || 0}</b></span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-500">
                                    <div className="flex items-center justify-end gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
