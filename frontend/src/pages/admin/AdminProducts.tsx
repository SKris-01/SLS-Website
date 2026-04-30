import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import { api } from '../../lib/api'
import AdminLayout from './AdminLayout'
import {
  Plus,
  Loader2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Search,
  Package,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'

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

// ─── Modal ──────────────────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onSave }: { product?: any; onClose: () => void; onSave: (data: any) => Promise<void> }) => {
  const [form, setForm] = useState<any>(product || {
    name: '', description: '', price: '', mrp: '', category: 'Makhana',
    stock: 100, imageUrl: '', images: [], tags: '', weight: '', flavour: ''
  })
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      let images = product.images || []
      if (typeof images === 'string') {
        images = images.split(',').filter(Boolean)
      }
      setForm((f: any) => ({ ...f, images }))
    }
  }, [product])

  const handleSave = async () => {
    if (!form.name || !form.price || !form.imageUrl || !form.category) {
      setError('Name, Price, Category, and Primary Image are required.')
      return
    }
    setSaving(true)
    try {
      const data = { ...form }
      if (typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      }
      data.price = Number(data.price)
      data.mrp = Number(data.mrp || data.price)
      data.stock = Number(data.stock)
      
      await onSave(data)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const addImageField = () => {
    setForm((f: any) => ({ ...f, images: [...(f.images || []), ''] }))
  }

  const removeImageField = (index: number) => {
    setForm((f: any) => ({ 
        ...f, 
        images: f.images.filter((_: any, i: number) => i !== index) 
    }))
  }

  const updateImageField = (index: number, value: string) => {
    const newImages = [...form.images]
    newImages[index] = value
    setForm((f: any) => ({ ...f, images: newImages }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
       <div className="bg-white rounded shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
             <h3 className="text-lg font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h3>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
             </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {error && (
                <div className="bg-red-50 border border-red-200 px-4 py-3 rounded text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Product Name</label>
                    <input
                        value={form.name}
                        onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none transition-colors"
                    />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                    <textarea
                        value={form.description}
                        rows={4}
                        onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none transition-colors resize-none"
                    />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Hero Image URL</label>
                    <input
                        value={form.imageUrl}
                        onChange={e => setForm((f: any) => ({ ...f, imageUrl: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none transition-colors"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Price (₹)</label>
                    <input
                        type="number"
                        value={form.price}
                        onChange={e => setForm((f: any) => ({ ...f, price: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none transition-colors"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">MRP (₹)</label>
                    <input
                        type="number"
                        value={form.mrp}
                        onChange={e => setForm((f: any) => ({ ...f, mrp: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none transition-colors"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                    <input
                        value={form.category}
                        onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none transition-colors"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Stock</label>
                    <input
                        type="number"
                        value={form.stock}
                        onChange={e => setForm((f: any) => ({ ...f, stock: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none transition-colors"
                    />
                </div>
                <div className="space-y-1 text-xs">
                    <label className="font-semibold text-gray-500 uppercase">Weight</label>
                    <input value={form.weight} onChange={e => setForm((f: any) => ({ ...f, weight: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 outline-none" />
                </div>
                <div className="space-y-1 text-xs">
                    <label className="font-semibold text-gray-500 uppercase">Flavour</label>
                    <input value={form.flavour} onChange={e => setForm((f: any) => ({ ...f, flavour: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 outline-none" />
                </div>
             </div>

              {/* Gallery Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Product Gallery</label>
                    <button 
                        type="button"
                        onClick={addImageField}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add Image
                    </button>
                </div>
                
                <div className="space-y-2">
                    {form.images?.map((url: string, index: number) => (
                        <div key={index} className="flex gap-2">
                            <input
                              placeholder="Image URL"
                              value={url}
                              onChange={e => updateImageField(index, e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-900"
                            />
                            <button 
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="p-2 text-gray-400 hover:text-red-600 border border-gray-300 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {(!form.images || form.images.length === 0) && (
                        <p className="text-xs text-gray-400 italic">No gallery images added yet.</p>
                    )}
                </div>
              </div>
          </div>

          <footer className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
             <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">Cancel</button>
             <button
               onClick={handleSave}
               disabled={saving}
               className="bg-gray-900 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
             >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {product ? 'Update Product' : 'Create Product'}
             </button>
          </footer>
       </div>
    </div>
  )
}

const AdminProducts = () => {
  const { getToken } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; product?: any }>({ open: false })
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
  }

  const fetchProducts = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/admin/products', { token })
      setProducts(data)
    } catch {
      // not available yet
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSave = async (data: any) => {
    const token = await getToken()
    try {
      if (modal.product) {
         await api(`/api/admin/products/${modal.product.id}`, { method: 'PATCH', token, body: data })
         showNotification('Product updated successfully')
      } else {
         await api('/api/admin/products', { method: 'POST', token, body: data })
         showNotification('Product created successfully')
      }
      fetchProducts()
    } catch (err: any) {
      showNotification(err.message || 'Failed to save product', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this product? This cannot be undone.')) return
    try {
       const token = await getToken()
       await api(`/api/admin/products/${id}`, { method: 'DELETE', token })
       showNotification('Product deleted permanently')
       fetchProducts()
    } catch (err: any) {
       showNotification(err.message || 'Operation failed', 'error')
    }
  }

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      {modal.open && <ProductModal product={modal.product} onClose={() => setModal({ open: false })} onSave={handleSave} />}

      <div className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
               <p className="text-sm text-gray-500">Manage your store's products and stock levels.</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm outline-none focus:border-gray-900 w-full sm:w-64"
                  />
               </div>
               <button onClick={() => setModal({ open: true })} className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-800 flex items-center gap-2 shrink-0">
                  <Plus className="w-4 h-4" />
                  Add Product
               </button>
            </div>
         </div>

         {loading ? (
            <div className="py-20 flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-20 bg-white border border-gray-200 rounded text-center">
               <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-500">No products found.</p>
            </div>
         ) : (
            <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase text-xs">Product</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs">Category</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs">Price</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs">Stock</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.imageUrl} alt="" className="w-10 h-10 rounded bg-gray-100 object-cover" />
                                            <div>
                                                <p className="font-bold text-gray-900">{p.name}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{p.description.slice(0, 50)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{p.category}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">₹{p.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                                            ${p.stock < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {p.stock} in stock
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setModal({ open: true, product: p })} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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

export default AdminProducts
