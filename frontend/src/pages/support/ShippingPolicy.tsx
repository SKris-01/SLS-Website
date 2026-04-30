import { Link } from 'react-router-dom'
import LegalLayout from './LegalLayout'

const ShippingPolicy = () => (
  <LegalLayout title="Shipping Policy">
    <div className="space-y-12">
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-primary/40">Last Updated: 25 March 2026</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">1. Overview</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          By placing an order on <strong>shriyanslotusseeds.com</strong>, you agree to the terms outlined in this Shipping Policy.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">2. Order Processing</h2>
        <div className="bg-white border border-gray-100 p-8 rounded-3xl space-y-4 shadow-sm">
          <ul className="list-disc ml-6 space-y-3 text-gray-700">
            <li><strong>Processing Time:</strong> Orders are typically processed within 2–3 business days from confirmation.</li>
            <li><strong>Non-Working Days:</strong> Orders are not processed on Sundays or public holidays.</li>
            <li><strong>Delays:</strong> In case of high order volumes, processing may be delayed. Customers will be informed accordingly.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">3. Shipping and Delivery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <h3 className="font-bold text-primary">Delivery Timeline</h3>
             <p className="text-sm text-gray-600">Estimated delivery time is <strong>3–7 business days</strong>, depending on location.</p>
          </div>
          <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
             </div>
             <h3 className="font-bold text-amber-900">Delivery Notes</h3>
             <p className="text-sm text-amber-800/80">Delays may occur due to logistics, weather, or regulations. Timelines are indicative and not guaranteed.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">4. Shipping Charges</h2>
        <div className="bg-white border border-gray-100 p-8 rounded-3xl space-y-4 shadow-sm">
          <ul className="list-disc ml-6 space-y-3 text-gray-700">
            <li><strong>Charges:</strong> Shipping charges, if applicable, will be displayed at checkout.</li>
            <li><strong>Promotions:</strong> Free shipping offers, if any, will be clearly communicated on the website.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">5. Order Tracking</h2>
        <div className="bg-gray-50 p-8 rounded-3xl space-y-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="space-y-2">
              <h3 className="font-bold text-primary uppercase tracking-widest text-xs">Tracking Details</h3>
              <p className="text-gray-700">Once shipped, customers will receive tracking details via email/SMS.</p>
            </div>
            <div className="h-px w-full md:w-px md:h-12 bg-gray-200"></div>
            <div className="space-y-2">
              <h3 className="font-bold text-primary uppercase tracking-widest text-xs">Information Provided</h3>
              <p className="text-gray-700">Tracking ID and courier partner details will be shared.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">6. Delivery Issues</h2>
        <div className="bg-white border border-gray-100 p-8 rounded-3xl space-y-4 shadow-sm">
          <ul className="list-disc ml-6 space-y-3 text-gray-700">
            <li><strong>Missing Delivery:</strong> If tracking shows delivered but order not received, notify us within 48 hours.</li>
            <li><strong>Delays:</strong> Customers must report significant delivery delays within a reasonable time.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">7. Damaged or Tampered Packages</h2>
        <div className="bg-red-50/50 border border-red-100 p-8 rounded-3xl space-y-4">
          <p className="text-red-900 font-medium italic mb-2">If the package is visibly damaged or tampered at delivery, customers should:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-red-100/50 shadow-sm">
              <span className="font-bold text-red-600 block mb-1">Option 1</span>
              <p className="text-sm text-gray-700">Refuse delivery if possible.</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-red-100/50 shadow-sm">
              <span className="font-bold text-red-600 block mb-1">Option 2</span>
              <p className="text-sm text-gray-700">Accept and report with photographic evidence within 48 hours.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">8. Risk of Loss</h2>
        <p className="text-gray-700 leading-relaxed bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
          <strong>Ownership Transfer:</strong> Risk of loss and ownership transfer to the customer upon successful delivery at the provided address.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">9. Contact Information</h2>
        <div className="bg-primary/5 p-8 rounded-3xl space-y-4">
          <p className="text-gray-700 font-medium">For shipping-related queries:</p>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <span className="text-primary font-bold">shriyanskris12@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <span className="text-primary font-bold">+91 80946 56597</span>
            </div>
          </div>
          <div className="pt-4 border-t border-primary/10">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <span className="text-primary font-bold">grievances@shriyanslotusseeds.com</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">10. Legal Compliance</h2>
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            This Shipping Policy is governed by applicable laws including the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
          </p>
          <div className="p-6 bg-accent/5 border border-accent/10 rounded-2xl inline-block">
            <p className="text-primary/70">
              For returns and refunds, please refer to our{' '}
              <Link to="/refund-policy" className="text-accent font-bold hover:underline decoration-2">
                Refund & Cancellation Policy
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  </LegalLayout>
)

export default ShippingPolicy


