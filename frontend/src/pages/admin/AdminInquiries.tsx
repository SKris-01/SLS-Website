import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  MessageSquare,
  Search,
  Mail,
  Calendar,
  Loader2,
  Trash2,
  Clock,
  ExternalLink
} from 'lucide-react'

const AdminInquiries = () => {
  const { getToken } = useAuth()
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null)

  const fetchInquiries = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/admin/inquiries', { token })
      setInquiries(data)
    } catch (err) {
      console.error('Fetch inquiries error:', err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchInquiries() }, [fetchInquiries])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = await getToken()
      await api(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        token,
        body: { status }
      })
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq))
    } catch (err) {
      console.error('Update status error:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    try {
      const token = await getToken()
      await api(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        token
      })
      setInquiries(prev => prev.filter(inq => inq.id !== id))
      if (selectedInquiry?.id === id) setSelectedInquiry(null)
    } catch (err) {
      console.error('Delete inquiry error:', err)
    }
  }

  const filtered = inquiries.filter(inq => 
    !search || 
    inq.name.toLowerCase().includes(search.toLowerCase()) || 
    inq.email.toLowerCase().includes(search.toLowerCase()) ||
    inq.message.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-serif italic">Customer Inquiries</h1>
            <p className="text-sm text-gray-500 font-serif">Manage leads and messages from the contact form.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search inquiries..."
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
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">No inquiries found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* List */}
            <div className={`bg-white border border-gray-200 rounded overflow-hidden shadow-sm ${selectedInquiry ? 'lg:col-span-4' : 'lg:col-span-12'}`}>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase text-[10px] font-bold tracking-wider">
                          <tr>
                              <th className="px-6 py-4">Sender</th>
                              {!selectedInquiry && <th className="px-6 py-4">Message Preview</th>}
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                          {filtered.map(inq => (
                              <tr 
                                key={inq.id} 
                                onClick={() => setSelectedInquiry(inq)}
                                className={`cursor-pointer transition-colors ${selectedInquiry?.id === inq.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                              >
                                  <td className="px-6 py-4">
                                      <p className="font-bold text-gray-900">{inq.name}</p>
                                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{inq.email}</p>
                                  </td>
                                  {!selectedInquiry && (
                                    <td className="px-6 py-4 text-gray-500 italic truncate max-w-[300px]">
                                        "{inq.message}"
                                    </td>
                                  )}
                                  <td className="px-6 py-4">
                                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        inq.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                        inq.status === 'REPLIED' ? 'bg-green-100 text-green-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}>
                                        {inq.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(inq.id) }}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                      >
                                          <Trash2 className="w-4 h-4" />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
            </div>

            {/* Inquiry Details */}
            {selectedInquiry && (
              <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-lg sticky top-8">
                 <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between border-b pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                {selectedInquiry.name[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-serif">{selectedInquiry.name}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Mail className="w-3 h-3" />
                                    {selectedInquiry.email}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right text-xs text-gray-400">
                                <p className="font-bold uppercase flex items-center justify-end gap-1">
                                    <Calendar className="w-3 h-3" /> 
                                    {new Date(selectedInquiry.createdAt).toLocaleDateString()}
                                </p>
                                <p className="flex items-center justify-end gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(selectedInquiry.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Message</p>
                         <p className="text-gray-800 leading-relaxed font-serif whitespace-pre-wrap italic">
                            "{selectedInquiry.message}"
                         </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
                        <div className="flex items-center gap-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Mark As:</p>
                            <button 
                              onClick={() => handleUpdateStatus(selectedInquiry.id, 'NEW')}
                              className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${selectedInquiry.status === 'NEW' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                            >
                                New
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(selectedInquiry.id, 'READ')}
                              className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${selectedInquiry.status === 'READ' ? 'bg-gray-700 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                            >
                                Read
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(selectedInquiry.id, 'REPLIED')}
                              className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${selectedInquiry.status === 'REPLIED' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                            >
                                Replied
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <a 
                              href={`mailto:${selectedInquiry.email}?subject=Regarding your inquiry - Makhana Store`}
                              className="bg-accent text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Reply via Email
                            </a>
                            <button 
                                onClick={() => setSelectedInquiry(null)}
                                className="text-gray-400 hover:text-gray-900 text-xs font-bold uppercase underline"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminInquiries
