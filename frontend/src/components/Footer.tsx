import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import logo from '../assets/icon/logo.png'

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-white/5 pt-24 pb-12 px-6 md:px-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 mb-16">
        {/* Brand Section */}
        <div className="md:col-span-4">
          <Link to="/" className="flex items-center gap-4 group mb-6">
            <img src={logo} alt="Shriyans Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-3xl font-black tracking-tighter text-white group-hover:text-accent transition-colors uppercase">
                SHRIYANS
              </span>
              <span className="text-[11px] font-bold tracking-[0.3em] text-white/50 group-hover:text-white transition-colors uppercase mt-1">
                Lotus Seeds
              </span>
            </div>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm font-medium">
            Bringing you the finest quality Makhana with hand-crafted flavors since 2025. Crunchy, healthy, and delicious.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2">
          <h4 className="text-white font-medium mb-4 uppercase tracking-widest text-[10px] font-sans">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-white/50 text-xs font-medium uppercase tracking-wider">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-accent transition-colors">Products</Link></li>
            <li><Link to="/recipes" className="hover:text-accent transition-colors">Recipes</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About Story</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div className="md:col-span-3">
          <h4 className="text-white font-medium mb-4 uppercase tracking-widest text-[10px] font-sans">Support and Legal</h4>
          <ul className="flex flex-col gap-2.5 text-white/50 text-xs font-medium uppercase tracking-wider">
            <li><Link to="/terms" className="hover:text-accent transition-colors">Terms and Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-accent transition-colors">Refunds and Cancellations</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-3">
          <h4 className="text-white font-medium mb-4 uppercase tracking-widest text-[10px] font-sans">Get in Touch</h4>
          <ul className="flex flex-col gap-4 text-white/50 text-xs font-medium tracking-wider">
            <li className="flex items-start gap-3 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-accent shrink-0" /> 
              <span className="break-all">shriyanskris12@gmail.com</span>
            </li>
            <li className="flex items-start gap-3 hover:text-white transition-colors">
               <MapPin className="w-4 h-4 text-accent shrink-0" />
               <span>Kila no. 37/3/1, Vill-Khijuri, Dharuhera, Rewari, Haryana, India-123106</span>
            </li>
            <li className="flex items-start gap-3 hover:text-white transition-colors">
               <Phone className="w-4 h-4 text-accent shrink-0" />
               <span>+91 80946 56597</span>
            </li>
          </ul>
          
          <div className="flex items-center gap-4 mt-8">
             <a href="#" className="p-2.5 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full transition-all text-white"><Instagram className="w-4 h-4" /></a>
             <a href="#" className="p-2.5 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full transition-all text-white"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-white/10 pt-10 text-center">
        <p className="text-white/20 text-xs tracking-[0.2em] uppercase font-medium">
          &copy; 2026 Shriyans Lotus Seeds. Crafting the perfect crunch.
        </p>
      </div>
    </footer>
  )
}

export default Footer
