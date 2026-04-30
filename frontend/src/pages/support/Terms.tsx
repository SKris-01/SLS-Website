import LegalLayout from './LegalLayout'

const Terms = () => (
  <LegalLayout title="Terms and Conditions">
    <div className="space-y-12">
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-primary/40">Last Updated: 22 March 2026</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">1. Agreement to Terms</h2>
        <p>By accessing and purchasing from shriyanslotusseeds.com, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Website or purchase our products.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">2. Product Descriptions & Allergen Warnings</h2>
        <div className="space-y-4 ml-4">
          <p><strong>Accuracy:</strong> We make every effort to display as accurately as possible the colors, images, and descriptions of our flavoured makhana. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>
          <p><strong>Allergens:</strong> Our makhana may be processed in facilities that handle nuts, dairy, soy, or gluten. Specific flavor profiles may contain these allergens. It is your responsibility to review the ingredient list on the product packaging before purchasing or consumption.</p>
          <p><strong>Health Claims:</strong> Our products are food snacks. Any statements regarding health benefits (e.g., "high protein," "gluten-free") are based on general nutritional data and are not intended to diagnose, treat, cure, or prevent any disease.</p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">3. Pricing and Payment</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Currency:</strong> All prices are listed in INR.</li>
          <li><strong>Changes:</strong> Prices for our products are subject to change without notice.</li>
          <li><strong>Taxes:</strong> Prices may exclude applicable taxes (GST/VAT/Sales Tax), which will be calculated at checkout.</li>
          <li><strong>Errors:</strong> In the event of a pricing error, we reserve the right to cancel any orders placed for the product listed at the incorrect price.</li>
          <li><strong>Payment Security:</strong> All payments are processed through secure, PCI-DSS compliant payment gateways. We do not store your full credit card information on our servers.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">4. Orders and Acceptance</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Availability:</strong> All orders are subject to product availability.</li>
          <li><strong>Acceptance:</strong> Your placement of an order constitutes an offer to buy. We reserve the right to refuse any order placed with us for any reason (e.g., suspicious activity, out of stock).</li>
          <li><strong>Quantity Limits:</strong> We reserve the right to limit the quantities of any products or services that we offer.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">5. User Accounts and Security</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Account Creation:</strong> If you create an account on our website, you are responsible for maintaining the confidentiality of your account credentials (username and password).</li>
          <li><strong>Responsibility:</strong> You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.</li>
          <li><strong>Accuracy:</strong> You agree to provide accurate and complete information when creating an account.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">6. Shipping and Delivery</h2>
        <p>All orders are subject to our <a href="/shipping-policy" className="text-accent underline font-bold">Shipping Policy</a>. Risk of loss and title pass to the customer upon successful delivery at the provided shipping address.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">7. Returns, Refunds, and Exchange Policy</h2>
        <p>Due to the nature of food products, our return policy is strict. For complete details on eligibility, timelines, and cancellations, please refer to our <a href="/refund-policy" className="text-accent underline font-bold">Refunds and Cancellations Policy</a>.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">8. Shelf Life and Storage</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Best Before:</strong> Please check the "Best Before" date printed on the pack.</li>
          <li><strong>Storage:</strong> To maintain crispness, store in a cool, dry place and reseal the packet tightly after opening. We are not liable for loss of quality due to improper storage after delivery.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">9. Regulatory Compliance</h2>
        <div className="bg-primary text-white p-8 rounded-3xl space-y-4 shadow-xl shadow-primary/20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Manufactured/Marketed by</p>
            <p className="text-lg font-bold">Shriyans Lotus Seeds LLP</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">FSSAI License No</p>
              <p className="font-bold">20825017000728</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">GSTIN</p>
              <p className="font-bold">06AFPFS5866J1Z6</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Packaging Address</p>
              <p className="font-medium">Kila no. 37/3/1, Vill-Khijuri, Dharuhera, Rewari, Haryana, India-123106</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">10. Force Majeure</h2>
        <p>We shall not be liable for any failure or delay in performance under these Terms (other than payment obligations) due to causes beyond our reasonable control, including but not limited to acts of God, natural disasters, floods, fires, earthquakes, strikes, labour disputes, government actions, or internet/telecommunications failures.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">11. Intellectual Property</h2>
        <p>All content included on this site, such as text, graphics, logos, images, and software, is the property of Shriyans Lotus Seeds LLP and is protected by international copyright laws. You may not use our branding or content without express written permission.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">12. Limitation of Liability</h2>
        <p>In no event shall Shriyans Lotus Seeds LLP, its directors, employees, or affiliates be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including without limitation damages for loss of profits, goodwill, use, data, or other intangible losses. Nothing in this section shall limit or exclude liability where such limitation is not permitted under applicable Indian law.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">13. Indemnification</h2>
        <p>You agree to indemnify, defend, and hold harmless Shriyans Lotus Seeds LLP from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your breach of these Terms or your violation of any law or the rights of a third party.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">14. Governing Law & Dispute Resolution</h2>
        <div className="space-y-4">
          <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the jurisdiction of the competent courts in Haryana, India.</p>
          <p>Before initiating legal proceedings, both parties may attempt resolution through:</p>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Direct negotiation via our support team</li>
            <li>Mediation through a mutually agreed mediator in Haryana</li>
          </ol>
          <p>If unresolved after 60 days, disputes shall be subject to the exclusive jurisdiction of courts in Haryana, India.</p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">15. Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Support Email</p>
            <p className="font-bold text-primary">shriyanskris12@gmail.com</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Phone</p>
            <p className="font-bold text-primary">+91 80946 56597</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Country of Origin</p>
            <p className="font-bold text-primary">India</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">16. Grievance Redressal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Grievance Officer</p>
            <p className="font-bold text-primary">Shubhendu Krishna</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Email</p>
            <p className="font-bold text-primary">grievances@shriyanslotusseeds.com</p>
          </div>
        </div>
        <p><strong>Response Timeline:</strong> We aim to acknowledge your complaint within 48 hours and resolve it within 30 days.</p>
      </section>
    </div>
  </LegalLayout>
)

export default Terms


