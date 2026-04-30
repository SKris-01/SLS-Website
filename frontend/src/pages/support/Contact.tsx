import { useState } from 'react'
import { Mail, Phone, Clock, MapPin, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '../../lib/api'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api('/api/inquiries', {
        method: 'POST',
        body: formData
      })
      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-8xl font-serif font-black text-primary mb-4 md:mb-6 italic tracking-tight uppercase">Get in Touch</h1>
          <p className="text-primary/40 font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] md:text-xs px-4">Elevate Your Queries to Our Concierge</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          {/* Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-primary p-8 md:p-12 rounded-[32px] md:rounded-[48px] text-white flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 md:mb-10 italic text-accent">Contact Information</h2>
                
                <div className="space-y-10">
                    <div className="flex items-start gap-4 md:gap-6 group">
                        <div className="bg-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:bg-accent transition-colors shrink-0">
                            <Mail className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 mb-1">Email Concierge</p>
                            <p className="text-lg md:text-xl font-serif break-all">shriyanskris12@gmail.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 md:gap-6 group">
                        <div className="bg-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:bg-accent transition-colors shrink-0">
                            <Phone className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 mb-1">Customer Care</p>
                            <p className="text-lg md:text-xl font-serif">+91 80946 56597</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 md:gap-6 group">
                        <div className="bg-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:bg-accent transition-colors shrink-0">
                            <Clock className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 mb-1">Business Hours</p>
                            <p className="text-lg md:text-xl font-serif">Mon - Sat: 10AM - 7PM</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-secondary/20 p-6 md:p-8 rounded-[32px] md:rounded-[40px] flex-1">
                 <h3 className="text-xl font-serif font-bold mb-4 text-primary italic">Our Address</h3>
                 <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-accent shrink-0" />
                    <p className="text-primary/70 font-medium leading-relaxed font-serif">
                        Kila no. 37/3/1, Vill-Khijuri, Dharuhera, Rewari, Haryana, India-123106<br/>
                        India
                    </p>
                 </div>
                 
                 {/* Map Placeholder */}
                 <div className="mt-8 relative aspect-video rounded-3xl overflow-hidden shadow-soft border border-primary/5">
                    <iframe 
                      title="location-map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.7178044918155!2d76.69953703397421!3d28.185496442147688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d4f6c9b7c811b%3A0x2c76e828d6282ba2!2sKhijuri%2C%20Haryana%20123106!5e0!3m2!1sen!2sin!4v1776178564740!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                    />
                 </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-16 rounded-[32px] md:rounded-[60px] border border-primary/5 shadow-soft">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                   <div className="bg-green-100 p-6 rounded-full mb-6">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                   </div>
                   <h2 className="text-3xl font-serif font-bold text-primary mb-4 italic">Message Sent!</h2>
                   <p className="text-primary/60 max-w-sm mb-8">Thank you for Reaching out. Our concierge will get back to you shortly.</p>
                   <button 
                     onClick={() => setSuccess(false)}
                     className="bg-primary text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs"
                   >
                     Send Another
                   </button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-12 italic">Send a Message</h2>
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-2">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name" 
                          className="w-full bg-secondary/10 border-none rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none focus:bg-white focus:ring-4 ring-accent/5 transition-all font-medium text-primary text-sm shadow-soft" 
                        />
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-2">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Your Email" 
                          className="w-full bg-secondary/10 border-none rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none focus:bg-white focus:ring-4 ring-accent/5 transition-all font-medium text-primary text-sm shadow-soft" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-2">Your Message</label>
                      <textarea 
                        rows={6} 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we help your snack cravings?" 
                        className="w-full bg-secondary/10 border-none rounded-[32px] md:rounded-[40px] px-6 md:px-8 py-5 md:py-6 outline-none focus:bg-white focus:ring-4 ring-accent/5 transition-all font-medium text-primary text-sm resize-none shadow-soft"
                      ></textarea>
                    </div>
                    {error && <p className="text-red-500 text-xs font-bold pl-2">{error}</p>}
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent text-white py-5 md:py-6 rounded-full font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[12px] md:text-sm hover:scale-[1.02] transition-all shadow-2xl shadow-accent/20 active:scale-95 duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : 'Submit Request'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
