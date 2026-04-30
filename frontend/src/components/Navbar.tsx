import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { Show, useUser } from "@clerk/react";
import SearchDrawer from './SearchDrawer'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { useCart } from '../context/CartContext'
import logo from '../assets/icon/logo.png'

const ProfileAvatar = ({ size = 'sm', noLink = false }: { size?: 'sm' | 'lg', noLink?: boolean }) => {
  const { user } = useUser()
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-xl' : 'w-9 h-9 text-sm'
  const content = (
    <>
      {user?.imageUrl
        ? <img src={user.imageUrl} alt={user?.firstName || 'Profile'} className="w-full h-full object-cover" />
        : <span>{(user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || 'U').toUpperCase()}</span>
      }
    </>
  )

  if (noLink) {
    return <div className={`${sizeClass} rounded-full border-2 border-brand-red/20 overflow-hidden flex items-center justify-center bg-brand-red font-black text-white`}>{content}</div>
  }

  return (
    <Link
      to="/profile"
      className={`${sizeClass} rounded-full border-2 border-brand-red/20 hover:border-brand-red transition-all overflow-hidden flex items-center justify-center bg-brand-red font-black text-white hover:scale-110 scale-100 duration-200`}
    >
      {content}
    </Link>
  )
}

const Navbar = () => {
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const location = useLocation()
  const navRef = useRef<HTMLUListElement>(null)
  const isHome = location.pathname === '/'
  const isOrders = location.pathname.startsWith('/profile/order') || location.pathname.startsWith('/checkout')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close overlays on navigation
  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }, [location.pathname])

  // Update sliding indicator position
  useEffect(() => {
    if (!navRef.current) return

    // Find the active link element
    const activeLink = navRef.current.querySelector('.active') as HTMLElement
    if (activeLink) {
      setIndicatorStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth
      })
    } else {
      // Hide indicator if no link is active (e.g., on Cart or Product Details page)
      setIndicatorStyle({
        left: 0,
        width: 0
      })
    }
  }, [location.pathname])

  // Background and appearance logic
  const getNavBackground = () => {
    if (isSearchOpen) return 'bg-transparent'
    if (isScrolled || isMenuOpen) return 'bg-primary/90 backdrop-blur-md border-b border-white/10 shadow-lg py-2'
    return 'bg-primary py-4' // Solid primary color (#5B0F2E) at the top
  }

  const getTextColor = () => {
    return 'text-white' // Always white for consistency in this dark theme
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (location.pathname === to) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 py-3 px-4 md:px-8 z-50 flex items-center justify-between transition-all duration-500 ${getNavBackground()}`}>
        {/* Logo Section */}
        <Link
          to="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex items-center gap-3 leading-none group cursor-pointer"
        >
          <img src={logo} alt="Shriyans Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <div className="flex flex-col items-start">
            <span className={`text-xl md:text-2xl font-black tracking-tight transition-colors ${getTextColor()}`}>
              SHRIYANS
            </span>
            <span className={`text-[10px] md:text-[12px] font-bold tracking-[0.4em] self-end -mt-1 transition-colors uppercase ${isScrolled || isMenuOpen || !isHome && !isOrders ? 'text-white/70' : 'text-white/50'}`}>
              Lotus Seeds
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative">
            <ul ref={navRef} className={`flex items-center gap-8 text-sm uppercase tracking-widest ${getTextColor()}`}>
              <li>
                <NavLink to="/" onClick={(e) => handleLinkClick(e, '/')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" onClick={(e) => handleLinkClick(e, '/products')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/recipes" onClick={(e) => handleLinkClick(e, '/recipes')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  Recipes
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={(e) => handleLinkClick(e, '/about')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className={({ isActive }) => `relative py-2 font-bold transition-colors duration-300 ${isActive ? 'active opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  Contact
                </NavLink>
              </li>
            </ul>
            {/* Sliding Single Indicator (Desktop only) */}
            <span
              className="absolute bottom-0 h-0.5 bg-accent transition-all duration-[800ms] ease-out pointer-events-none"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`
              }}
            />
          </div>
        </div>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex relative group items-center">
            <input
              type="text"
              placeholder="Search products..."
              onFocus={() => setIsSearchOpen(true)}
              className={`bg-secondary/20 hover:bg-secondary/40 border border-white/10 rounded-full px-6 py-1.5 w-48 lg:w-64 focus:w-80 focus:bg-white focus:text-primary transition-all duration-300 text-sm font-bold outline-none shadow-sm ${getTextColor()}`}
            />
            <Search className={`absolute right-4 w-4 h-4 transition-colors pointer-events-none ${isScrolled || isMenuOpen || !isHome ? 'text-white/40 group-focus-within:text-white' : 'text-primary/40 group-focus-within:text-primary'}`} />
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className={`md:hidden p-2 hover:bg-secondary/20 rounded-full transition-all ${getTextColor()}`}
          >
            <Search className="w-6 h-6" />
          </button>

          <Link to="/cart" onClick={(e) => handleLinkClick(e, '/cart')} className={`p-2 hover:bg-secondary/20 rounded-full transition-all relative group ${getTextColor()}`}>
            <ShoppingCart className="w-5 md:w-6 h-5 md:h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] md:text-xs font-black flex items-center justify-center rounded-full shadow-lg border-2 border-primary animate-in zoom-in duration-300">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center">
            <Show when="signed-out">
              <Link to="/sign-in" className="bg-accent text-white px-6 py-1.5 rounded-full font-bold text-sm hover:scale-105 transition-all cursor-pointer block shadow-lg shadow-black/20">
                Sign In
              </Link>
            </Show>
            <Show when="signed-in">
              <ProfileAvatar />
            </Show>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 hover:bg-secondary/20 rounded-lg transition-all ${getTextColor()}`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#5B0F2E] md:hidden z-[9999] flex flex-col transition-all duration-500 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        {/* Header in Overlay */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-white/5">
          <div className="flex items-center gap-3 leading-none uppercase">
            <img src={logo} alt="Shriyans Logo" className="w-10 h-10 object-contain" />
            <div className="flex flex-col items-start leading-none uppercase">
              <span className="text-white text-xl font-black tracking-tight">SHRIYANS</span>
              <span className="text-white/40 text-[10px] font-bold tracking-[0.4em] self-end -mt-1">Lotus Seeds</span>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Links Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto w-full">
          <ul className="flex flex-col items-center gap-10 w-full py-10">
            {[
              { name: 'Home', path: '/' },
              { name: 'Products', path: '/products' },
              { name: 'Recipes', path: '/recipes' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' }
            ].map((item) => (
              <li
                key={item.name}
                className="w-full text-center"
              >
                <NavLink
                  to={item.path}
                  onClick={(e) => { setIsMenuOpen(false); handleLinkClick(e, item.path); }}
                  className={({ isActive }) => `text-3xl font-black uppercase tracking-[0.2em] transition-all relative inline-block
                      ${isActive ? 'text-accent' : 'text-white/80 hover:text-white'}
                    `}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent" />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Auth/Profile Footer */}
        <div className="p-12 border-t border-white/5 bg-black/20">
          <Show when="signed-out">
            <Link
              to="/sign-in"
              className="bg-accent text-white w-full py-5 rounded-full font-black uppercase text-base tracking-widest cursor-pointer flex items-center justify-center gap-3 shadow-2xl shadow-accent/20 border border-accent/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </Show>
          <Show when="signed-in">
            <div className="flex flex-col items-center">
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex flex-col items-center gap-4 group">
                <div className="relative p-1 rounded-full border border-accent/30">
                  <ProfileAvatar size="lg" noLink />
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-2">
                    Account Profile
                  </span>
                  <span className="text-white/40 font-bold uppercase text-[9px] tracking-[0.4em] mt-1">Manage Settings</span>
                </div>
              </Link>
            </div>
          </Show>
        </div>
      </div>
      {/* Modular Search Drawer Component */}
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Navbar
