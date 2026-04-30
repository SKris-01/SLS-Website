import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoMsg, setPromoMsg] = useState<{text: string, type: 'error'|'success'} | null>(null)

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-8">
           <div className="mx-auto w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10">
              <ShoppingBag className="w-12 h-12 text-primary/40" />
           </div>
           
           <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Your cart is empty</h1>
              <p className="text-primary/60 font-medium uppercase tracking-widest text-xs">Looks like you haven't added anything yet</p>
           </div>

           <Link to="/products" className="inline-block bg-primary text-white px-12 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
             Start Shopping
           </Link>
        </div>
      </div>
    )
  }

  const subtotal = getCartTotal()
  const shipping = subtotal >= 499 ? 0 : 49
  const total = subtotal + shipping

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 bg-gray-50/30">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
          {/* Left Side: Product List */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
               <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4 md:gap-6 group">
                 <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-between py-1">
                   <div className="pr-10 relative">
                     <h3 className="font-bold text-primary text-base md:text-lg line-clamp-1">{item.name}</h3>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-1">Makhana</p>
                     
                     <button
                       onClick={() => removeFromCart(item.id)}
                       className="absolute -top-1 right-0 text-primary/20 hover:text-red-500 transition-colors p-2"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                   
                   <div className="flex items-end justify-between mt-4">
                     <p className="text-xl font-bold text-primary">₹{item.currentPrice}</p>
                     
                     <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
                       <button
                         onClick={() => updateQuantity(item.id, -1)}
                         className="w-6 h-6 flex items-center justify-center text-primary/40 hover:text-primary transition-colors text-lg font-bold"
                       >
                         -
                       </button>
                       <span className="text-sm font-bold w-6 text-center text-primary">{item.quantity}</span>
                       <button
                         onClick={() => updateQuantity(item.id, 1)}
                         className="w-6 h-6 flex items-center justify-center text-primary/40 hover:text-primary transition-colors text-lg font-bold"
                       >
                         +
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
            ))}
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-8">
              <h2 className="text-2xl font-serif font-bold text-primary">Order Summary</h2>

              <div className="space-y-4 border-b border-gray-100 pb-6">
                <div className="flex justify-between items-center text-xs font-medium text-primary/60">
                  <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-bold text-primary">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-primary/60">
                  <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-primary font-bold'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && <p className="text-[10px] text-primary/40 italic">Free shipping on orders above ₹499</p>}
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold uppercase tracking-widest text-primary">Total Amount</span>
                <span className="text-3xl font-bold text-primary">₹{total}</span>
              </div>

              <Link to="/checkout" className="w-full bg-primary text-white py-5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-primary/95 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/10 cursor-pointer">
                Proceed to Checkout
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-inner px-2">
                  <input 
                    type="text" 
                    placeholder="PROMO CODE" 
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg(null) }}
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-[10px] font-bold tracking-widest text-primary placeholder:text-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!promoCode.trim()) {
                        setPromoMsg({ text: 'Enter a promo code.', type: 'error' })
                        return
                      }
                      setPromoMsg({ text: 'Promo codes are not available yet.', type: 'error' })
                    }}
                    className="bg-white border border-gray-200 text-primary px-6 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Apply
                  </button>
                </div>
                {promoMsg && (
                  <p className={`text-[9px] font-bold uppercase tracking-widest text-center ${promoMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {promoMsg.text}
                  </p>
                )}
                
                <p className="text-center text-primary/30 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-primary/30" />
                    Secure Checkout Powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
