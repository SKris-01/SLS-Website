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
  Youtube,
  Play,
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

const RecipeModal = ({ recipe, onClose, onSave }: { recipe?: any; onClose: () => void; onSave: (data: any) => Promise<void> }) => {
  const [form, setForm] = useState<any>(recipe || {
    title: '',
    thumbnail: '',
    channel: 'Cooking With Shriyans',
    type: 'Snack',
    link: '',
    isActive: true
  })
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!form.title || !form.link || !form.type) {
      setError('Title, Video Link, and Category are required.')
      return
    }

    let finalThumbnail = form.thumbnail
    if (!finalThumbnail && form.link.includes('youtube.com/watch?v=')) {
      const videoId = form.link.split('v=')[1]?.split('&')[0]
      if (videoId) finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    } else if (!finalThumbnail && form.link.includes('youtu.be/')) {
        const videoId = form.link.split('youtu.be/')[1]?.split('?')[0]
        if (videoId) finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }

    setSaving(true)
    try {
      await onSave({ ...form, thumbnail: finalThumbnail })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save recipe.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
       <div className="bg-white rounded shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
          <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
             <h3 className="text-lg font-bold text-gray-900">{recipe ? 'Edit Recipe' : 'Add New Recipe'}</h3>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
             </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {error && (
                <div className="bg-red-50 border border-red-200 px-4 py-2 rounded text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Recipe Title</label>
                    <input
                        value={form.title}
                        onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none"
                    />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">YouTube Link</label>
                    <input
                        value={form.link}
                        onChange={e => setForm((f: any) => ({ ...f, link: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none"
                    />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Thumbnail URL (Optional)</label>
                    <input
                        value={form.thumbnail}
                        onChange={e => setForm((f: any) => ({ ...f, thumbnail: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none"
                    />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                   <select
                      value={form.type}
                      onChange={e => setForm((f: any) => ({ ...f, type: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none"
                   >
                      {['Snack', 'Dessert', 'Healthy', 'Main Course', 'Appetizer'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                   </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Channel Name</label>
                    <input
                        value={form.channel}
                        onChange={e => setForm((f: any) => ({ ...f, channel: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-900 outline-none"
                    />
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
                {recipe ? 'Update Recipe' : 'Add Recipe'}
             </button>
          </footer>
       </div>
    </div>
  )
}

const AdminRecipes = () => {
  const { getToken } = useAuth()
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; recipe?: any }>({ open: false })
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
  }

  const fetchRecipes = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/admin/recipes', { token })
      setRecipes(data)
    } catch {
      // not available yet
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchRecipes() }, [fetchRecipes])

  const handleSave = async (data: any) => {
    const token = await getToken()
    try {
      if (modal.recipe) {
         await api(`/api/admin/recipes/${modal.recipe.id}`, { method: 'PATCH', token, body: data })
         showNotification('Recipe updated successfully')
      } else {
         await api('/api/admin/recipes', { method: 'POST', token, body: data })
         showNotification('Recipe created successfully')
      }
      fetchRecipes()
    } catch (err: any) {
      showNotification(err.message || 'Failed to save recipe', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return
    try {
       const token = await getToken()
       await api(`/api/admin/recipes/${id}`, { method: 'DELETE', token })
       showNotification('Recipe deleted successfully')
       fetchRecipes()
    } catch (err: any) {
       showNotification(err.message || 'Operation failed', 'error')
    }
  }

  const filtered = recipes.filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      {modal.open && <RecipeModal recipe={modal.recipe} onClose={() => setModal({ open: false })} onSave={handleSave} />}

      <div className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">Recipe Management</h1>
               <p className="text-sm text-gray-500">Manage video recipes and culinary content.</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    placeholder="Search recipes..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm outline-none focus:border-gray-900 w-full sm:w-64"
                  />
               </div>
               <button onClick={() => setModal({ open: true })} className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-800 flex items-center gap-2 shrink-0">
                  <Plus className="w-4 h-4" />
                  Add Recipe
               </button>
            </div>
         </div>

         {loading ? (
            <div className="py-20 flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
         ) : filtered.length === 0 ? (
            <div className="py-20 bg-white border border-gray-200 rounded text-center">
               <Youtube className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-500">No recipes found.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {filtered.map(r => (
                  <div key={r.id} className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm flex flex-col">
                     <div className="relative aspect-video">
                        <img src={r.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                           <Play className="w-8 h-8 text-white opacity-80" />
                        </div>
                        <div className="absolute top-2 left-2">
                           <span className="bg-gray-900/80 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">{r.type}</span>
                        </div>
                     </div>

                     <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-900 mb-1 truncate">{r.title}</h3>
                        <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                           <Youtube className="w-3 h-3" />
                           {r.channel}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                           <span className="text-[10px] text-gray-400 font-mono">#{r.id.slice(0, 6).toUpperCase()}</span>
                           <div className="flex gap-2">
                              <button onClick={() => setModal({ open: true, recipe: r })} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(r.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </AdminLayout>
  )
}

export default AdminRecipes
