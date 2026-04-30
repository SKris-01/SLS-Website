import { useState, useEffect, useCallback } from 'react'
import { useAuth, useUser } from "@clerk/react"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'
import {
  MapPin, Plus, CreditCard, ShieldCheck, ArrowLeft,
  Loader2, CheckCircle2, AlertCircle
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────
interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  line1: string
  line2: string | null
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault: boolean
}

// ─── Load Razorpay Script ──────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// ─── Banner Component ──────────────────────────────────────────────────────
const Banner = ({ type, msg }: { type: 'success' | 'error'; msg: string }) => (
  <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border shadow-sm
    ${type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-primary/5 border-primary/10 text-primary'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
    {msg}
  </div>
)

// ─── Checkout Page ─────────────────────────────────────────────────────────
const Checkout = () => {
  const { isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const { cart, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Determine what we're checking out: the full cart or a direct buy single item
  const directBuyItem = location.state?.directBuyItem
  const isDirectBuy = !!directBuyItem
  const checkoutItems = isDirectBuy ? [directBuyItem] : cart

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [successOrderId, setSuccessOrderId] = useState('')
  const [orderCancelled, setOrderCancelled] = useState(false)
  const [cancelledOrder, setCancelledOrder] = useState<any>(null)

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({ 
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
  const [savingAddress, setSavingAddress] = useState(false)

  const showBanner = (type: 'success' | 'error', msg: string) => {
    setBanner({ type, msg })
    setTimeout(() => setBanner(null), 5000)
  }

  // Redirect if cart empty or not signed in
  useEffect(() => {
    if (checkoutItems.length === 0 && !orderSuccess && !orderCancelled) navigate('/cart')
  }, [checkoutItems, navigate, orderSuccess, orderCancelled])

  useEffect(() => {
    if (isLoaded && !isSignedIn) navigate('/sign-in')
  }, [isLoaded, isSignedIn, navigate])

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    try {
      const token = await getToken()
      const data = await api('/api/users/addresses', { token })
      setAddresses(data || [])
      // Auto-select default or first
      const defaultAddr = data?.find((a: Address) => a.isDefault)
      if (defaultAddr) setSelectedAddress(defaultAddr.id)
      else if (data?.length > 0) setSelectedAddress(data[0].id)
    } catch {
      // user may not exist in DB yet
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { fetchAddresses() }, [fetchAddresses])

  // Save new address
  const handleSaveAddress = async () => {
    if (!addressForm.label || !addressForm.firstName || !addressForm.lastName || !addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.zip || !addressForm.phone || !addressForm.country) {
      showBanner('error', 'Please fill all required fields.')
      return
    }
    setSavingAddress(true)
    try {
      const token = await getToken()
      const newAddr = await api('/api/users/addresses', { method: 'POST', token, body: addressForm })
      setAddressForm({ label: '', firstName: '', lastName: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'India', phone: '' })
      setShowAddressForm(false)
      await fetchAddresses()
      if (newAddr?.id) setSelectedAddress(newAddr.id)
    } catch (err: any) {
      showBanner('error', err.message || 'Failed to save address.')
    } finally {
      setSavingAddress(false)
    }
  }

  // Calculate totals
  const subtotal = isDirectBuy 
    ? parseFloat(directBuyItem.currentPrice) * (directBuyItem.quantity || 1)
    : getCartTotal()
  const shipping = subtotal >= 499 ? 0 : 49
  const total = subtotal + shipping

  // Build order items from either the direct buy item or the cart
  const buildItems = () => checkoutItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
  }))

  const handleRazorpayPayment = async () => {
    setProcessing(true)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        showBanner('error', 'Razorpay script failed to load.')
        setProcessing(false)
        return
      }

      const token = await getToken()

      const data = await api('/api/payment/create-order', {
        method: 'POST',
        token,
        body: {
          items: buildItems(),
          addressId: selectedAddress,
        },
      })

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Shriyans Makhana',
        description: 'Elite Lotus Seed Collection',
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          if (!response.razorpay_payment_id || !response.razorpay_order_id) {
            showBanner('error', 'Payment data missing from provider.')
            setProcessing(false)
            return
          }

          try {
            const freshToken = await getToken()
            const verifyData = await api('/api/payment/verify', {
              method: 'POST',
              token: freshToken,
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              },
            })

            if (verifyData.success) {
              if (!isDirectBuy) await clearCart()
              setSuccessOrderId(verifyData.order.id)
              setOrderSuccess(true)
            } else {
              showBanner('error', 'Payment verification failed.')
            }
          } catch (err: any) {
            showBanner('error', err.message || 'Payment verification error.')
          }
          setProcessing(false)
        },
        prefill: {},
        theme: { color: '#5B0F2E' },
        modal: {
          ondismiss: async () => {
            setProcessing(false)
            setOrderCancelled(true)
            
            try {
              const token = await getToken()
              await api('/api/payment/cancel', {
                method: 'POST',
                token,
                body: { orderId: data.orderId },
              })
              const orderData = await api(`/api/orders/${data.orderId}`, { token })
              setCancelledOrder(orderData)
            } catch {
              // ignore
            }
          },
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      showBanner('error', err.message || 'Payment initiation failed.')
      setProcessing(false)
    }
  }

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      showBanner('error', 'Select a shipping address first.')
      return
    }
    handleRazorpayPayment()
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-8">
           <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-full h-full bg-white border border-primary/20 rounded-full flex items-center justify-center shadow-xl">
                 <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
           </div>
           
           <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Order Confirmed!</h1>
              <p className="text-primary/60 font-medium uppercase tracking-widest text-xs">Thank you for your purchase</p>
           </div>

           <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 shadow-sm">
              <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest mb-2">Order ID</p>
              <h2 className="text-xl font-mono font-bold text-primary mb-8">#{successOrderId.slice(0, 12).toUpperCase()}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Link to="/orders" className="bg-primary text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">View My Orders</Link>
                 <Link to="/" className="bg-white text-primary border border-primary/10 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-primary/5 transition-all">Back to Home</Link>
              </div>
           </div>
        </div>
      </div>
    )
  }

  if (orderCancelled) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-8">
           <div className="mx-auto w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10">
              <AlertCircle className="w-12 h-12 text-primary/40" />
           </div>
           
           <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Payment Cancelled</h1>
              <p className="text-primary/60 font-medium uppercase tracking-widest text-xs">The transaction was not completed</p>
           </div>

           {cancelledOrder && (
            <div className="bg-white border border-primary/10 rounded-3xl p-6 text-left shadow-sm">
              <p className="text-[10px] font-bold uppercase text-primary/30 tracking-widest mb-4">Summary</p>
              <div className="space-y-3 mb-6">
                {cancelledOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-primary/70 font-medium">{item.name} × {item.quantity}</span>
                    <span className="text-primary font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Total Amount</span>
                <span className="text-xl font-bold text-primary">₹{cancelledOrder.total}</span>
              </div>
            </div>
           )}

           <Link to="/products" className="inline-block bg-primary text-white px-12 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 md:px-8 bg-gray-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Link to="/cart" className="inline-flex items-center gap-2 text-primary/60 hover:text-primary font-bold uppercase text-[10px] tracking-widest mb-4 transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Checkout</h1>
            {banner && <Banner type={banner.type} msg={banner.msg} />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-10">
            
            {/* ── Address Section ── */}
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  Shipping Address
                </h2>
                {!showAddressForm && (
                  <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest hover:underline transition-all">
                    <Plus className="w-4 h-4" /> Add New
                  </button>
                )}
              </div>

              {addresses.length > 0 && !showAddressForm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`text-left p-6 rounded-2xl border-2 transition-all relative
                        ${selectedAddress === addr.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30 bg-white'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{addr.label}</span>
                        {addr.isDefault && <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Default</span>}
                      </div>
                      <p className="text-primary font-bold text-lg mb-1">{addr.firstName} {addr.lastName}</p>
                      <p className="text-primary/60 text-sm mb-1">{addr.line1}</p>
                      <p className="text-primary/60 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-primary/40 font-bold text-[10px] uppercase tracking-widest">
                        <span>{addr.phone}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showAddressForm && (
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-primary mb-6">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                      { key: 'label', placeholder: 'Address Label (Home, Office, etc.)' },
                      { key: 'firstName', placeholder: 'First Name' },
                      { key: 'lastName', placeholder: 'Last Name' },
                      { key: 'line1', placeholder: 'Address Line 1', span: true },
                      { key: 'line2', placeholder: 'Address Line 2 (Optional)', span: true },
                      { key: 'city',  placeholder: 'City' },
                      { key: 'state', placeholder: 'State' },
                      { key: 'zip',   placeholder: 'Zip Code' },
                      { key: 'country', placeholder: 'Country' },
                      { key: 'phone', placeholder: 'Phone Number' },
                    ].map(({ key, placeholder, span }) => (
                      <div key={key} className={`${span ? 'md:col-span-2' : ''}`}>
                         <input
                            placeholder={placeholder}
                            value={(addressForm as any)[key]}
                            onChange={e => setAddressForm(f => ({ ...f, [key]: e.target.value }))}
                            className="w-full bg-white border border-gray-200 text-primary px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm transition-all"
                         />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={handleSaveAddress} disabled={savingAddress} className="bg-primary text-white py-3 px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-all shadow-md">
                      {savingAddress ? 'Saving...' : 'Save Address'}
                    </button>
                    <button onClick={() => setShowAddressForm(false)} className="text-primary/50 hover:text-primary font-bold uppercase text-[10px] tracking-widest transition-all">Cancel</button>
                  </div>
                </div>
              )}
            </section>

            {/* ── Payment Section ── */}
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-3">
                 <CreditCard className="w-6 h-6 text-primary" />
                 Payment Method
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className={`p-6 rounded-2xl border-2 border-primary bg-primary/5`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center border-primary text-primary`}>
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    <ShieldCheck className={`w-5 h-5 text-primary`} />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-1">Pay Online</h3>
                  <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">Cards, UPI, Net Banking (Razorpay)</p>
                </div>
              </div>
            </section>
          </div>

          {/* ── Summary Column ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-8">
              <h2 className="text-2xl font-serif font-bold text-primary">Order Summary</h2>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {checkoutItems.map(item => (
                  <div key={item.id || item.productId} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-primary font-bold text-sm truncate">{item.name}</p>
                      <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                      <p className="text-primary font-bold text-base mt-1">₹{Number(item.currentPrice) * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs font-medium text-primary/60">
                  <span>Subtotal</span>
                  <span className="text-primary font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium text-primary/60">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-primary font-bold'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && <p className="text-[10px] text-primary/40 italic">Free shipping on orders above ₹499</p>}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm font-bold uppercase tracking-widest text-primary">Total</span>
                  <span className="text-3xl font-bold text-primary">₹{total}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing || (!selectedAddress && !showAddressForm)}
                  className={`w-full py-5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/10
                    ${(processing || (!selectedAddress && !showAddressForm)) ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:bg-primary/95 hover:-translate-y-0.5'}`}
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  {processing ? 'Processing...' : 'Place Order'}
                </button>
                
                <p className="text-center mt-6 flex items-center justify-center gap-2 text-primary/30 text-[9px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
