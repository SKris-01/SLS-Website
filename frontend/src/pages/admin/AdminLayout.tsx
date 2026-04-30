import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from "@clerk/react"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  X,
  ExternalLink,
  ChevronRight,
  Bell,
  Search,
  Menu as MenuIcon
} from 'lucide-react'

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2 rounded font-medium text-sm transition-colors
      ${active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
  >
    <Icon className="w-4 h-4 shrink-0" />
    <span className="flex-1 truncate">{label}</span>
    {active && <ChevronRight className="w-3 h-3" />}
  </Link>
)

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useUser()

  const breadcrumbs = location.pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1))

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Logo / Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
             <Link to="/" className="text-xl font-bold tracking-tight">
               Store Admin
             </Link>
             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
             </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            <div>
               <p className="px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">Management</p>
               <div className="space-y-1">
                  <SidebarItem to="/admin" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/admin'} />
                  <SidebarItem to="/admin/products" icon={Package} label="Products" active={location.pathname === '/admin/products'} />
                  <SidebarItem to="/admin/orders" icon={ShoppingBag} label="Orders" active={location.pathname === '/admin/orders'} />
                  <SidebarItem to="/admin/users" icon={Users} label="Users" active={location.pathname === '/admin/users'} />
                  <SidebarItem to="/admin/inquiries" icon={MessageSquare} label="Inquiries" active={location.pathname === '/admin/inquiries'} />
               </div>
            </div>

            <div>
               <p className="px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">Storefront</p>
               <div className="space-y-1">
                  <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                     <ExternalLink className="w-4 h-4" />
                     View Website
                  </Link>
               </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
             <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition-colors cursor-pointer">
                <img src={user?.imageUrl} alt="" className="w-8 h-8 rounded-full bg-gray-700" />
                <div className="truncate flex-1">
                   <p className="text-xs font-semibold truncate">{user?.fullName || 'Admin'}</p>
                   <p className="text-[10px] text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
                 <span>Admin</span>
                 <ChevronRight className="w-3 h-3" />
                 <span className="text-gray-900 font-bold">{breadcrumbs[breadcrumbs.length - 1] || 'Dashboard'}</span>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center relative">
                 <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                 <input 
                    placeholder="Search..." 
                    className="bg-gray-100 border border-transparent rounded px-10 py-2 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all w-64"
                 />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
           </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
