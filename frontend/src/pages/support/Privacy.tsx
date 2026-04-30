import LegalLayout from './LegalLayout'

const Privacy = () => (
  <LegalLayout title="Privacy Policy">
    <div className="space-y-12">
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-primary/40 mb-2">Last Updated: 22 March 2026</p>
        <p className="text-sm font-bold uppercase tracking-widest text-primary/40">Effective Date: 22 March 2026</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">1. Introduction</h2>
        <div className="space-y-4">
          <p>Welcome to shriyanslotusseeds.com ("we," "us," "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website shriyanslotusseeds.com and purchase our flavoured makhana products.</p>
          <p>We act as a Data Fiduciary under applicable Indian data protection laws.</p>
          <p><strong>Regulatory Compliance:</strong> We comply with applicable food safety regulations including FSSAI guidelines. Our manufacturing and marketing practices adhere to local statutory requirements.</p>
          <p className="p-4 bg-primary/5 border-l-4 border-accent rounded-r-xl italic font-serif text-primary">
            Note: All products listed on this website are sold directly by Shriyans Lotus Seeds LLP.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">2. Information We Collect</h2>
        <p>We may collect information about you in a variety of ways.</p>
        
        <div className="space-y-6 ml-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-primary">A. Personal Data</h3>
            <p>When you place an order or create an account, we may collect:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Name</li>
              <li>Billing and Shipping Address</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Payment Information (Credit Card details, UPI ID, etc.)</li>
            </ul>
            <p className="text-sm italic">Note: We do not store full credit card numbers; they are processed through secure, PCI DSS compliant payment gateways. We collect and process your personal data for lawful purposes connected with our services.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-primary">B. Derivative Data</h3>
            <p>Information our servers automatically collect when you access the Website, such as:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>IP Address</li>
              <li>Browser Type</li>
              <li>Operating System</li>
              <li>Access Times</li>
              <li>Pages viewed</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-primary">C. Cookies and Tracking Technologies</h3>
            <p>We use cookies to enhance your experience (e.g., remembering your cart). You can choose to disable cookies through your browser settings, but this may limit your ability to use certain features of the site.</p>
            <p>We use the following types of cookies:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Essential Cookies:</strong> Required for website functionality (cart, checkout)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand traffic via Google Analytics (anonymized)</li>
              <li><strong>Marketing Cookies:</strong> Used for retargeting ads (only with your consent)</li>
            </ul>
            <p>You can manage cookie preferences via your browser settings or our cookie banner. Disabling essential cookies may limit website functionality. Non-essential cookies are activated only after obtaining your explicit consent via our cookie banner.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">3. How We Use Your Information</h2>
        <p>We use the information we collect for the following business purposes:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Order Fulfillment:</strong> To process and deliver your makhana orders.</li>
          <li><strong>Communication:</strong> To send order confirmations, shipping updates, and customer service responses.</li>
          <li><strong>Marketing:</strong> To send newsletters or promotional offers (only with your consent).</li>
          <li><strong>Improvement:</strong> To analyze website traffic and improve our product offerings.</li>
          <li><strong>Security:</strong> To detect and prevent fraud or unauthorized transactions.</li>
        </ul>
        <p>You may withdraw your consent at any time using the contact details provided below.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">4. Disclosure of Your Information</h2>
        <p>We do not sell your personal data. We may share information with:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (e.g., payment processing, data analysis, email delivery, hosting services).</li>
          <li><strong>Logistics Partners:</strong> Courier companies required to deliver your products.</li>
          <li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">5. Data Security</h2>
        <p>We use administrative, technical, and physical security measures to help protect your personal information (including SSL encryption). However, no electronic transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">6. Food Safety & Allergen Data</h2>
        <p>While not "personal data," please note that we collect dietary preference information if you voluntarily provide it (e.g., via customer support queries). We use this strictly to recommend suitable products. Always check the product packaging for the most accurate allergen information.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">7. Your Privacy Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
          <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails at any time.</li>
          <li><strong>Withdraw Consent:</strong> You may withdraw previously given consent for data processing at any time.</li>
        </ul>
        <p>To exercise these rights, contact us at <strong>shriyanskris12@gmail.com</strong></p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">8. Policy for Children</h2>
        <p>We do not knowingly collect personal data from children under the age of 18. If you are a parent/guardian and believe your child has provided data, contact us immediately for deletion. If we become aware that personal data of a minor has been collected without parental consent, we will delete such data promptly.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">9. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. The updated version will indicate a revised "Last Updated" date. We encourage you to periodically review this page.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">10. International Data Transfers</h2>
        <p>To deliver our services, your data may be processed by trusted third-party providers located outside India (e.g., Razorpay for payments, Google Cloud for hosting). We ensure such transfers comply with applicable Indian data protection laws through contractual safeguards and due diligence.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">11. Data Retention</h2>
        <p>We retain your personal data only for as long as necessary to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Fulfill your orders and provide customer support</li>
          <li>Comply with legal, accounting, or tax obligations (e.g., GST records retained for 6 years)</li>
          <li>Enforce our Terms and Conditions</li>
          <li>With your explicit consent for marketing purposes</li>
        </ul>
        <p>Data will be deleted or anonymized upon withdrawal of consent, unless retention is required by law. Upon request and subject to legal exceptions, we will securely delete or anonymize your personal data.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">12. Grievance Officer</h2>
        <p>In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, we have appointed a Grievance Officer to address privacy-related concerns:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Name</p>
            <p className="font-bold text-primary">Shubhendu Krishna</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Designation</p>
            <p className="font-bold text-primary">Grievance Officer, Shriyans Lotus Seeds LLP</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Email</p>
            <p className="font-bold text-primary">grievances@shriyanslotusseeds.com</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Phone</p>
            <p className="font-bold text-primary">+91 80946 56597</p>
          </div>
        </div>
        <p><strong>Response Timeline:</strong> We aim to acknowledge your complaint within 48 hours and resolve it within 30 days from receipt.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">13. Third-Party Links</h2>
        <p>Our website may contain links to external sites (e.g., social media, payment partners). We are not responsible for the privacy practices or content of these third parties. We encourage you to review their privacy policies before providing any personal information.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-primary italic">14. Contact Us & Regulatory Details</h2>
        <div className="space-y-6">
          <p>If you have questions or comments about this policy, you may email us at <strong>shriyanskris12@gmail.com</strong> or contact us by post at:</p>
          
          <div className="bg-primary text-white p-8 rounded-3xl space-y-4 shadow-xl shadow-primary/20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Company Name</p>
              <p className="text-lg font-bold">Shriyans Lotus Seeds LLP</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Physical Address</p>
              <p className="font-medium">Kila no. 37/3/1, Vill-Khijuri, Dharuhera, Rewari, Haryana, India-123106</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">GSTIN</p>
                <p className="font-bold">06AFPFS5866J1Z6</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">FSSAI License No</p>
                <p className="font-bold">20825017000728</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </LegalLayout>
)



export default Privacy

