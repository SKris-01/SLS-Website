import React from 'react'
import { Receipt, Globe, Mail, Phone } from 'lucide-react'


interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  product: {
    name: string
  }
}

interface Address {
  label: string
  line1: string
  line2: string | null
  city: string
  state: string
  zip: string
}

interface Order {
  id: string
  status: string
  paymentMethod: string
  total: number
  subtotal: number
  discount: number
  shippingCost: number
  createdAt: string
  address: Address | null
  items: OrderItem[]
}

interface InvoiceProps {
  order: Order
}

const Invoice: React.FC<InvoiceProps> = ({ order }) => {
  return (
    <div className="bg-white text-black p-8 md:p-12 max-w-4xl mx-auto shadow-none print:shadow-none print:p-0 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-100 pb-10 mb-10 gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2">MAKHANA CO.</h1>
          <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Premium Roasted Makhanas</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black uppercase italic text-slate-300 mb-2">Invoice</h2>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider">#{order.id.toUpperCase()}</p>
            <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Store Details</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-slate-300 mt-0.5" />
              <p className="text-sm font-medium">www.makhanaco.com</p>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-300 mt-0.5" />
              <p className="text-sm font-medium">support@makhanaco.com</p>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-300 mt-0.5" />
              <p className="text-sm font-medium">+91 98765 43210</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Ship To</h3>
          {order.address ? (
            <div className="space-y-1">
              <p className="text-sm font-black uppercase">{order.address.label}</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {order.address.line1}<br />
                {order.address.line2 && <>{order.address.line2}<br /></>}
                {order.address.city}, {order.address.state}<br />
                {order.address.zip}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Self-Pickup / Address Not Provided</p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mb-12 overflow-hidden border border-slate-100 rounded-3xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Item Description</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Qty</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Price</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-5">
                  <p className="text-sm font-bold uppercase tracking-tight">{item.name}</p>
                </td>
                <td className="px-6 py-5 text-center text-sm font-medium">{item.quantity}</td>
                <td className="px-6 py-5 text-right text-sm font-medium">₹{item.price}</td>
                <td className="px-6 py-5 text-right text-sm font-black tracking-tight">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Payment Info</h3>
          <p className="text-sm font-bold mb-1 uppercase tracking-tight">{order.paymentMethod}</p>
          <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-widest">Thank you for your business. Please keep this invoice for your records.</p>
        </div>

        <div className="w-full md:w-64 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold uppercase tracking-widest text-slate-400 text-[10px]">Subtotal</span>
            <span className="font-bold tracking-tight">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold uppercase tracking-widest text-slate-400 text-[10px]">Shipping</span>
            <span className="font-bold tracking-tight">{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-green-600">
            <span className="font-bold uppercase tracking-widest text-[10px]">Discount</span>
            <span className="font-bold tracking-tight">-₹{order.discount}</span>
          </div>
          <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-center">
            <span className="font-black uppercase italic tracking-tighter text-xl">Total</span>
            <span className="font-black italic tracking-tighter text-2xl">₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-10 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Authorized Representative</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-200">
           <Receipt className="w-8 h-8" />
        </div>
      </div>
    </div>
  )
}


export default Invoice
