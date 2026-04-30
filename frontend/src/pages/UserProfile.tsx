import { useUser, useClerk, useAuth } from "@clerk/react"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  User, LogOut, Package, MapPin, Plus, Trash2, CheckCircle2, AlertCircle, ChevronRight, Loader2, Settings, Calendar, Phone
} from 'lucide-react'
import { api } from '../lib/api'

// Types
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

// Feedback Banner
const Banner = ({ type, msg }: { type: 'success' | 'error'; msg: string }) => (
  <div className={`flex items-center gap-3 px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest border mb-8 shadow-soft
    ${type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-primary/10 border-primary/20 text-primary'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
    {msg}
  </div>
)

// Personal Info Tab
const PersonalInfoTab = () => {
  const { user } = useUser()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName]   = useState(user?.lastName  || '')
  const [email]                   = useState(user?.primaryEmailAddress?.emailAddress || '')
  const [phone, setPhone]         = useState('')
  const [gender, setGender]       = useState('Male')
  
  const [saving, setSaving]       = useState(false)
  const [banner, setBanner]       = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const showBanner = (type: 'success' | 'error', msg: string) => {
    setBanner({ type, msg })
    setTimeout(() => setBanner(null), 4000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await user?.update({ firstName, lastName })
      showBanner('success', 'Profile updated successfully!')
    } catch (err: any) {
      showBanner('error', err.errors?.[0]?.message || err.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-[48px] p-8 md:p-16 border border-primary/5 shadow-soft h-full">
      {banner && <Banner type={banner.type} msg={banner.msg} />}

      <h2 className="text-3xl font-serif font-black text-primary mb-12 italic">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="flex flex-col gap-3">
          <label className="text-primary/40 font-black uppercase text-[10px] tracking-[0.3em] pl-2">Full Name</label>
          <input
            value={`${firstName} ${lastName}`}
            onChange={e => {
              const parts = e.target.value.split(' ')
              setFirstName(parts[0] || '')
              setLastName(parts.slice(1).join(' ') || '')
            }}
            className="bg-secondary/10 border-none text-primary px-8 py-5 rounded-3xl outline-none focus:bg-white focus:ring-4 ring-accent/5 font-bold text-sm transition-all shadow-soft"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-primary/40 font-black uppercase text-[10px] tracking-[0.3em] pl-2">Email Identity</label>
          <input
            readOnly
            value={email}
            className="bg-primary/5 border-none text-primary/30 px-8 py-5 rounded-3xl outline-none font-bold text-sm cursor-not-allowed italic"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-primary/40 font-black uppercase text-[10px] tracking-[0.3em] pl-2">Mobile Contact</label>
          <input
            type="tel"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="bg-secondary/10 border-none text-primary px-8 py-5 rounded-3xl outline-none focus:bg-white focus:ring-4 ring-accent/5 font-bold text-sm transition-all shadow-soft"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-primary/40 font-black uppercase text-[10px] tracking-[0.3em] pl-2">Gender Selection</label>
          <div className="flex items-center gap-8 px-4 py-5">
             <label className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={() => setGender('Male')} className="accent-accent" />
                <span className="text-sm font-black uppercase tracking-widest text-primary/60 group-hover:text-primary">Male</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={() => setGender('Female')} className="accent-brand-dark" />
                <span className="text-sm font-black uppercase tracking-widest text-primary/60 group-hover:text-primary">Female</span>
             </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-6 pt-10 border-t border-primary/5">
        <button
          onClick={() => {
            setFirstName(user?.firstName || '')
            setLastName(user?.lastName || '')
            setPhone('')
            setGender('Male')
            showBanner('success', 'Changes discarded.')
          }}
          className="bg-transparent text-primary/40 hover:text-primary font-black uppercase text-[10px] tracking-[0.3em] transition-all cursor-pointer"
        >
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white py-5 px-12 rounded-full font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

// Order History Tab
const OrderHistoryTab = () => {
  const { getToken } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const token = await getToken()
      return api('/api/orders', { token })
    },
  })

  const orders = (data?.orders || []).filter((o: Order) => o.status !== 'PENDING')

  if (isLoading) {
    return (
      <div className="bg-white rounded-[48px] p-24 border border-primary/5 flex items-center justify-center shadow-soft">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-[48px] py-32 px-12 flex flex-col items-center text-center shadow-soft border border-primary/5">
          <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mb-10">
            <Package className="w-10 h-10 text-accent/40" strokeWidth={1.5} />
          </div>
          <h3 className="text-primary font-serif font-black text-3xl italic mb-4">No Orders Discovered</h3>
          <p className="text-primary/30 font-black text-[10px] tracking-[0.4em] uppercase mb-12">
            Your exquisite collection awaits its first addition.
          </p>
          <a href="/products" className="bg-primary text-white hover:scale-105 py-5 px-12 rounded-full font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-2xl shadow-primary/20">
            Start Your Journey
          </a>
        </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500 text-white border-green-200'
      case 'SHIPPED': return 'bg-accent text-white border-accent/20'
      case 'CANCELLED': return 'bg-primary/20 text-primary border-primary/10'
      case 'PROCESSING': return 'bg-secondary text-primary border-primary/5'
      default: return 'bg-secondary/20 text-primary/40'
    }
  }

  return (
    <div className="space-y-6">
      {orders.map((order: any) => (
        <div 
          key={order.id} 
          onClick={() => navigate(`/profile/order/${order.id}`)}
          className="bg-white border border-primary/5 rounded-[40px] p-8 flex flex-col gap-8 shadow-soft hover:shadow-2xl hover:translate-y-[-4px] transition-all cursor-pointer group"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/5 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="text-primary font-serif font-black italic text-xl">Order #{order.id.slice(0, 8).toUpperCase()}</h4>
                  <span className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full border ${getStatusColor(order.status)} tracking-widest`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-primary/30 font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-6 md:pt-0 border-primary/5">
              <div className="text-right">
                <p className="text-[9px] font-black text-primary/30 uppercase tracking-widest mb-1">Investment</p>
                <p className="text-primary font-black text-3xl italic tracking-tighter">₹{order.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-primary/5">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 bg-secondary/5 text-primary text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl border border-primary/5 group-hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white border border-primary/5 overflow-hidden">
                   <img src={item.product?.imageUrl} className="w-full h-full object-cover" />
                </div>
                {item.product?.name || item.name}
                <span className="text-accent ml-2 italic">× {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Saved Addresses Tab
const SavedAddressesTab = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const token = await getToken()
      return api('/api/users/addresses', { token })
    },
  })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ 
    label: '', 
    firstName: '', 
    lastName: '', 
    line1: '', 
    line2: '', 
    city: '', 
    state: '', 
    zip: '', 
    country: 'India', 
    phone: '' 
  })
  const [saving, setSaving] = useState(false)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const showBannerMsg = (type: 'success' | 'error', msg: string) => {
    setBanner({ type, msg })
    setTimeout(() => setBanner(null), 4000)
  }

  const handleAdd = async () => {
    if (!form.label || !form.firstName || !form.lastName || !form.line1 || !form.city || !form.state || !form.zip || !form.phone) {
      showBannerMsg('error', 'Please fill all required fields.')
      return
    }
    setSaving(true)
    try {
      const token = await getToken()
      await api('/api/users/addresses', { method: 'POST', token, body: form })
      setForm({ label: '', firstName: '', lastName: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'India', phone: '' })
      setShowForm(false)
      showBannerMsg('success', 'Address curated successfully!')
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    } catch (err: any) {
      showBannerMsg('error', err.message || 'Failed to curate address.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken()
      await api(`/api/users/addresses/${id}`, { method: 'DELETE', token })
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    } catch {
      showBannerMsg('error', 'Failed to remove address.')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-[48px] p-24 shadow-soft border border-primary/5 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {banner && <Banner type={banner.type} msg={banner.msg} />}

      {addresses.length === 0 && !showForm && (
        <div className="bg-white rounded-[48px] py-16 px-12 flex flex-col items-center text-center shadow-soft border border-primary/5 mb-6">
          <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-8">
            <MapPin className="w-10 h-10 text-accent/40" strokeWidth={1.5} />
          </div>
          <h3 className="text-primary font-serif font-black text-2xl italic mb-4">No Locations Found</h3>
          <p className="text-primary/30 font-black text-[10px] tracking-[0.4em] uppercase">
            Let's define your delivery sanctuary.
          </p>
        </div>
      )}

      {addresses.map((addr: any) => (
        <div key={addr.id} className="bg-white border border-primary/5 rounded-[40px] p-8 flex items-start justify-between group hover:shadow-2xl hover:translate-y-[-4px] transition-all shadow-soft overflow-hidden">
          <div className="flex items-start gap-8">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/5 group-hover:bg-accent group-hover:text-white transition-all duration-500">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-3">
                <p className="text-primary font-serif font-black italic text-xl">{addr.label}</p>
                {addr.isDefault && <span className="bg-accent text-white text-[7px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest">Selected Sanctuary</span>}
              </div>
              <p className="text-primary/60 font-black text-xs uppercase tracking-widest mb-2">{addr.firstName} {addr.lastName}</p>
              <p className="text-primary/40 text-sm italic">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p className="text-primary/40 text-sm italic">{addr.city}, {addr.state} {addr.zip}</p>
              <div className="mt-4 flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-secondary/5 rounded-full inline-flex border border-primary/5">
                <Phone className="w-3 h-3 text-accent" />
                {addr.phone}
              </div>
            </div>
          </div>
          <button onClick={() => handleDelete(addr.id)} className="text-primary/10 hover:text-primary transition-colors p-3 bg-secondary/5 rounded-full">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}

      {showForm ? (
        <div className="bg-white border border-primary/5 rounded-[48px] p-10 md:p-16 shadow-2xl">
          <h3 className="text-3xl font-serif font-black italic text-primary mb-12">Curate New Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { key: 'label', placeholder: 'LOCATION LABEL (HOME, WORK...)', span: true },
              { key: 'firstName', placeholder: 'FIRST NAME' },
              { key: 'lastName', placeholder: 'LAST NAME' },
              { key: 'line1', placeholder: 'ADDRESS LINE 1', span: true },
              { key: 'line2', placeholder: 'STREET/LOCALITY (OPTIONAL)', span: true },
              { key: 'city',  placeholder: 'CITY' },
              { key: 'state', placeholder: 'STATE' },
              { key: 'zip',   placeholder: 'ZIP CODE' },
              { key: 'country', placeholder: 'COUNTRY' },
              { key: 'phone', placeholder: 'MOBILE IDENTITY' },
            ].map(({ key, placeholder, span }) => (
              <div key={key} className={`flex flex-col gap-3 ${span ? 'md:col-span-2' : ''}`}>
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/30 pl-2">{placeholder}</label>
                <input
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className={`bg-secondary/10 border-none text-primary px-8 py-5 rounded-3xl outline-none focus:bg-white focus:ring-4 ring-accent/5 font-bold text-sm transition-all shadow-soft`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button onClick={handleAdd} disabled={saving} className="bg-primary text-white py-6 px-12 rounded-full font-black uppercase text-[10px] tracking-[0.3em] font-serif transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 cursor-pointer">
              {saving ? 'CURATING...' : 'Curate Location'}
            </button>
            <button onClick={() => setShowForm(false)} className="text-primary/40 hover:text-primary font-black uppercase text-[10px] tracking-[0.3em] transition-all cursor-pointer">Go Back</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 bg-transparent border-4 border-dashed border-primary/5 text-primary/30 hover:text-primary hover:border-accent hover:bg-secondary/5 py-8 rounded-[40px] font-black uppercase text-[11px] tracking-[0.5em] transition-all flex items-center justify-center gap-4 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full border-2 border-primary/10 flex items-center justify-center group-hover:scale-125 transition-transform">
             <Plus className="w-5 h-5" />
          </div>
          Curate New Sanctuary
        </button>
      )}
    </div>
  )
}

// Account Tab
const AccountSettingsTab = ({ onSignOut }: { onSignOut: () => void }) => {
  const { user } = useUser()
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handleDeletePhoto = async () => {
    try {
      await user?.setProfileImage({ file: null })
      setBanner({ type: 'success', msg: 'Identity image reset.' })
      setTimeout(() => setBanner(null), 3000)
    } catch (err: any) {
      setBanner({ type: 'error', msg: err.errors?.[0]?.message || 'Failed to reset image.' })
      setTimeout(() => setBanner(null), 4000)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {banner && <Banner type={banner.type} msg={banner.msg} />}

      <div className="bg-white rounded-[48px] p-10 md:p-16 border border-primary/5 shadow-soft">
        <h3 className="text-3xl font-serif font-black italic text-primary mb-12">Security & Identity</h3>

        <div className="space-y-12">
          <div className="flex items-center justify-between pb-8 border-b border-primary/5">
            <div>
              <p className="text-primary font-black uppercase text-[10px] tracking-widest mb-2">IDENTIFICATION PHOTO</p>
              <p className="text-primary/40 text-xs italic">Customize your presence on our platform</p>
            </div>
            <button onClick={handleDeletePhoto} className="text-primary/40 hover:text-primary font-black uppercase text-[9px] tracking-widest bg-secondary/10 px-6 py-3 rounded-full transition-all">
              RESET IMAGE
            </button>
          </div>

          <div className="flex items-center justify-between pb-8 border-b border-primary/5">
            <div>
              <p className="text-primary font-black uppercase text-[10px] tracking-widest mb-2">ACCOUNT SIGNATURE</p>
              <p className="text-primary/40 text-xs font-mono">{user?.id}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary font-black uppercase text-[10px] tracking-widest mb-2">VALUED SINCE</p>
              <p className="text-primary/40 text-xs italic">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="mt-8 flex items-center justify-center gap-4 bg-primary text-white py-6 px-12 rounded-[32px] font-black uppercase text-[10px] tracking-[0.4em] transition-all w-full shadow-2xl shadow-primary/20 hover:bg-accent cursor-pointer group"
      >
        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Terminate Session
      </button>
    </div>
  )
}

// Main Page
type Tab = 'personal' | 'orders' | 'addresses' | 'settings'

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'personal',   label: 'My Profile',   icon: User    },
  { id: 'orders',     label: 'My Orders',    icon: Package },
  { id: 'addresses',  label: 'Addresses',    icon: MapPin  },
  { id: 'settings',   label: 'Settings',     icon: Settings},
]

const UserProfilePage = () => {
  const { isLoaded, user: clerkUser } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('personal')

  if (!isLoaded || !clerkUser) return null

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen pt-32 pb-32 px-4 md:px-12 bg-white">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-10">
          {/* Header */}
          <div className="bg-white border border-primary/5 rounded-[40px] p-8 flex flex-col items-center gap-6 shadow-soft text-center group">
             <div className="relative">
                 <div className="absolute -inset-2 bg-accent/20 rounded-full blur-xl group-hover:bg-accent/40 transition-all"></div>
                 <div className="relative w-24 h-24 rounded-full bg-secondary/20 overflow-hidden shrink-0 border-4 border-white shadow-soft">
                    <img src={clerkUser.imageUrl} alt="User" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
             </div>
             <div className="w-full">
                <h2 className="text-2xl font-serif font-black italic text-primary truncate px-2 leading-none mb-1">{clerkUser.fullName || 'Connoisseur'}</h2>
                <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 truncate">{clerkUser.primaryEmailAddress?.emailAddress}</p>
             </div>
          </div>

          {/* Nav */}
          <nav className="bg-white border border-primary/5 rounded-[40px] overflow-hidden shadow-soft">
             <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-6 px-8 py-5 transition-all text-[11px] font-black uppercase tracking-widest border-r lg:border-r-0 lg:border-b border-primary/5 last:border-0 whitespace-nowrap cursor-pointer
                      ${activeTab === id ? 'text-white bg-primary' : 'text-primary/40 hover:bg-secondary/10 hover:text-primary'}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-accent' : 'text-primary/20'}`} />
                    <span className="flex-1 text-left">{label}</span>
                    {activeTab === id && <ChevronRight className="hidden lg:block w-4 h-4 text-accent" />}
                  </button>
                ))}
             </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="lg:col-span-9 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {activeTab === 'personal'  && <PersonalInfoTab />}
          {activeTab === 'orders'    && <OrderHistoryTab />}
          {activeTab === 'addresses' && <SavedAddressesTab />}
          {activeTab === 'settings'  && <AccountSettingsTab onSignOut={handleSignOut} />}
        </main>
      </div>
    </div>
  )
}

export default UserProfilePage
