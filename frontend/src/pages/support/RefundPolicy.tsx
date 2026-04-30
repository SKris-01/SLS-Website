import LegalLayout from './LegalLayout'

const RefundPolicy = () => (
  <LegalLayout title="Refund & Cancellation Policy">
    <div className="space-y-12">
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-primary/40">Last Updated: 25 March 2026</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">1. Overview</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          By purchasing from <strong>shriyanslotusseeds.com</strong>, you agree to this Refund & Cancellation Policy.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">2. Order Cancellation</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-3">2.1 Cancellation by Customer</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li><strong>Cancellation Window:</strong> Orders may be cancelled only before dispatch.</li>
              <li><strong>Post-Dispatch:</strong> Once shipped, orders cannot be cancelled.</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-3">2.2 Cancellation Process</h3>
            <p className="text-gray-700 mb-2">Customers must request cancellation via:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li><strong>Email:</strong> shriyanskris12@gmail.com, grievances@shriyanslotusseeds.com</li>
              <li><strong>Phone:</strong> +91 80946 56597</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-3">2.3 Refund on Cancellation</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li><strong>Timeline:</strong> Approved cancellations will be refunded within 5–7 business days</li>
              <li><strong>Mode:</strong> Refunds will be processed to the original payment method</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">3. Return Policy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-white border border-green-100 rounded-3xl shadow-sm space-y-4">
             <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl font-bold">3.1</div>
             <h3 className="text-xl font-bold text-primary">Eligibility</h3>
             <p className="text-sm text-gray-600 italic mb-2">Due to the nature of food products:</p>
             <ul className="list-disc ml-4 space-y-2 text-sm text-gray-700">
               <li><strong>Unopened Products:</strong> Eligible for return within 10 days of delivery</li>
               <li><strong>Condition:</strong> Product must be unused, sealed, and in original packaging</li>
             </ul>
          </div>
          <div className="p-8 bg-white border border-red-50 rounded-3xl shadow-sm space-y-4">
             <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-xl font-bold">3.2</div>
             <h3 className="text-xl font-bold text-primary">Non-Returnable Items</h3>
             <ul className="list-disc ml-4 space-y-2 text-sm text-gray-700">
               <li>Opened products</li>
               <li>Partially consumed items</li>
               <li>Products damaged due to customer handling</li>
             </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">4. Damaged, Defective, or Incorrect Products</h2>
        <div className="bg-primary/5 border-l-4 border-accent p-8 rounded-r-3xl space-y-4">
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li><strong>Reporting Time:</strong> Must be reported within 48 hours of delivery</li>
            <li><strong>Proof:</strong> Customers must provide photographic evidence</li>
          </ul>
          <div className="pt-4 border-t border-primary/10">
            <p className="font-bold text-primary mb-2">Resolution Options:</p>
            <div className="flex gap-4">
              <span className="px-4 py-1 bg-white border border-primary/20 rounded-full text-sm font-medium">• Replacement</span>
              <span className="px-4 py-1 bg-white border border-primary/20 rounded-full text-sm font-medium">• Full refund</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">5. Refund Process</h2>
        <div className="bg-gray-50 p-8 rounded-3xl space-y-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
               <h3 className="font-bold text-primary">Approval</h3>
               <p className="text-gray-600">Refunds are processed after verification of the returned product or reported issue.</p>
            </div>
            <div className="space-y-3">
               <h3 className="font-bold text-primary">Timeline</h3>
               <p className="text-2xl font-bold text-primary tabular-nums">5–7 Business Days</p>
               <p className="text-xs text-gray-400">Additional time may be taken by banks/payment providers to reflect the credit.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">6. Return Shipping</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-6 border border-gray-100 rounded-2xl">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <h3 className="font-bold text-primary">Company Fault</h3>
              <p className="text-sm text-gray-600">Return shipping cost will be borne by us.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 border border-gray-100 rounded-2xl">
            <div className="p-3 bg-gray-100 rounded-xl text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <div>
              <h3 className="font-bold text-primary">Customer Fault</h3>
              <p className="text-sm text-gray-600">Return shipping cost will be borne by the customer.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">7. Company-Initiated Cancellation</h2>
        <div className="bg-white border border-gray-100 p-8 rounded-3xl space-y-4 shadow-sm">
          <p className="text-gray-700">We reserve the right to cancel orders due to:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li className="flex items-center gap-2 text-sm text-gray-600"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Product unavailability</li>
            <li className="flex items-center gap-2 text-sm text-gray-600"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Pricing errors</li>
            <li className="flex items-center gap-2 text-sm text-gray-600"><span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Suspected fraudulent activity</li>
          </ul>
          <p className="pt-4 border-t border-gray-100 text-sm italic font-medium">Refund: Full refund will be issued in such cases.</p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">8. Food Safety Limitation</h2>
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold text-amber-800">Hygiene and Safety Regulations</h3>
          <ul className="list-disc ml-6 space-y-2 text-amber-900/80">
            <li>Strict return policies apply to food products</li>
            <li>Opened items cannot be returned under any circumstances</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">9. Legal Compliance</h2>
        <p className="text-gray-700 leading-relaxed">
          This policy is governed by applicable laws including the <strong>Consumer Protection Act, 2019</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic underline-offset-8 decoration-accent/30 underline">10. Contact Information</h2>
        <div className="bg-primary/5 p-8 rounded-3xl space-y-4">
          <p className="text-gray-700 font-medium">For refund and cancellation queries:</p>
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
        </div>
      </section>
    </div>
  </LegalLayout>
)

export default RefundPolicy


