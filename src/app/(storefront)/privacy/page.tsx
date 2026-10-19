import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, UserCheck, Eye, RefreshCw, Mail, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | LORVEN GOLF',
  description: 'Learn how Lorven Golf collects, uses, and safeguards your personal data in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 19, 2026";

  return (
    <div className="bg-[#fafaf9] min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200/80 shadow-sm mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            DPDP Act, 2023 Compliant
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-zinc-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
            At <strong className="text-zinc-900">LORVEN GOLF</strong>, we respect your privacy and are committed to safeguarding your personal data. This policy explains our data processing practices in accordance with the <em>Digital Personal Data Protection (DPDP) Act, 2023</em> and applicable Indian laws.
          </p>
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-4">
            <span>Last Updated: <strong className="text-zinc-700">{lastUpdated}</strong></span>
            <span>Applicable to: <strong className="text-zinc-700">All users of Lorven Golf website & services</strong></span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200/80 shadow-sm space-y-12 text-zinc-700 leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">1</span>
              <h2 className="text-2xl font-bold text-zinc-900">Introduction & Scope</h2>
            </div>
            <p className="text-sm md:text-base mb-4">
              This Privacy Policy applies to personal data collected by <strong>LORVEN GOLF</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) through our website, mobile interface, or related sales channels. Under the DPDP Act, 2023, <strong>LORVEN GOLF</strong> operates as a <strong>Data Fiduciary</strong> determining the purpose and means of processing personal data provided by you (&quot;Data Principal&quot;).
            </p>
            <p className="text-sm md:text-base">
              By accessing, browsing, registering an account, or placing orders on our website, you consent to the collection, storage, and processing of your personal data as outlined in this policy.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">2</span>
              <h2 className="text-2xl font-bold text-zinc-900">Personal Data We Collect</h2>
            </div>
            <p className="text-sm md:text-base mb-4">
              We collect only the personal information necessary to deliver products, provide customer support, and improve your shopping experience:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
                <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" /> Identity & Contact Data
                </h3>
                <p className="text-xs text-zinc-600">Full name, email address, phone/mobile number, delivery & billing addresses, account username, and encrypted password.</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
                <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" /> Transaction & Payment Data
                </h3>
                <p className="text-xs text-zinc-600">Order history, items purchased, invoice records, and payment transaction references. Note: We do not store your raw card numbers or UPI PIN; transactions are processed by certified payment gateways (e.g. Razorpay).</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
                <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" /> Technical & Device Data
                </h3>
                <p className="text-xs text-zinc-600">IP address, browser type, operating system, approximate geographic location, session identifiers, and browsing interactions on our platform.</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
                <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" /> Communications & Marketing
                </h3>
                <p className="text-xs text-zinc-600">Customer support queries, feedback, review submissions, and your preferences for promotional communications (newsletter subscription).</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">3</span>
              <h2 className="text-2xl font-bold text-zinc-900">Purpose of Data Processing</h2>
            </div>
            <p className="text-sm md:text-base mb-4">
              We process your digital personal data solely for lawful, specific, and legitimate business purposes:
            </p>
            <ul className="space-y-3 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Order Fulfillment:</strong> Processing transactions, preparing golf equipment shipments, dispatching courier deliveries, and sending tracking notifications.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Account Management:</strong> Authenticating you during sign-in, maintaining your saved delivery addresses, wishlist, and past order records.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Customer Assistance & Returns:</strong> Handling return requests, warranty claims, queries, refunds, and post-purchase support.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Security & Fraud Prevention:</strong> Detecting unauthorized account access, fraudulent transactions, and ensuring site integrity.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Legal Compliance:</strong> Adhering to statutory tax requirements (GST invoices), financial auditing, and court/governmental notices.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">4</span>
              <h2 className="text-2xl font-bold text-zinc-900">Third-Party Data Processors</h2>
            </div>
            <p className="text-sm md:text-base mb-4">
              We never sell or rent your personal data to advertisers. We share data only with trusted, bound service partners (&quot;Data Processors&quot;) who operate under strict contractual safeguards:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-zinc-100 text-zinc-900 font-bold">
                  <tr>
                    <th className="p-3.5 border-b border-gray-200">Category</th>
                    <th className="p-3.5 border-b border-gray-200">Entity / Provider</th>
                    <th className="p-3.5 border-b border-gray-200">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-3.5 font-medium text-zinc-900">Payment Gateway</td>
                    <td className="p-3.5 text-zinc-600">Razorpay / PCI-DSS Compliant Processors</td>
                    <td className="p-3.5 text-zinc-600">Secure end-to-end payment processing & instant refund credits.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-zinc-900">Logistics & Shipping</td>
                    <td className="p-3.5 text-zinc-600">National Courier & Delivery Partners</td>
                    <td className="p-3.5 text-zinc-600">Physical dispatch and doorstep delivery of orders.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-zinc-900">Cloud Infrastructure</td>
                    <td className="p-3.5 text-zinc-600">Cloud Database & Storage Services</td>
                    <td className="p-3.5 text-zinc-600">Encrypted data hosting, asset storage, and backup redundancy.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-zinc-900">Communication & Notifications</td>
                    <td className="p-3.5 text-zinc-600">Transactional Email & SMS Gateways</td>
                    <td className="p-3.5 text-zinc-600">Dispatching OTPs, order updates, invoices, and password reset links.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">5</span>
              <h2 className="text-2xl font-bold text-zinc-900">Your Rights Under DPDP Act, 2023</h2>
            </div>
            <p className="text-sm md:text-base mb-4">
              As a Data Principal under Indian law, you are entitled to exercise the following rights regarding your personal data:
            </p>
            <div className="space-y-3 text-sm md:text-base">
              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <h4 className="font-bold text-zinc-900 mb-1">Right to Access Information</h4>
                <p className="text-zinc-600 text-xs md:text-sm">You have the right to request a summary of your personal data being processed by us, along with the identities of all third parties with whom your data has been shared.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <h4 className="font-bold text-zinc-900 mb-1">Right to Correction & Erasure</h4>
                <p className="text-zinc-600 text-xs md:text-sm">You may update inaccurate or out-of-date information in your account settings or request the erasure of your personal data unless retention is mandatory under applicable tax or financial regulations.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <h4 className="font-bold text-zinc-900 mb-1">Right to Withdraw Consent</h4>
                <p className="text-zinc-600 text-xs md:text-sm">Where processing is based on consent, you may withdraw your consent at any time. Withdrawal does not affect the legality of data processed prior to your request, but may prevent us from continuing to provide certain services.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <h4 className="font-bold text-zinc-900 mb-1">Right to Grievance Redressal</h4>
                <p className="text-zinc-600 text-xs md:text-sm">You have the right to register a complaint with our designated Grievance Officer. If your concern is not resolved to your satisfaction, you may escalate to the Data Protection Board of India.</p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">6</span>
              <h2 className="text-2xl font-bold text-zinc-900">Data Storage, Retention & Security</h2>
            </div>
            <p className="text-sm md:text-base mb-4">
              We implement industry-grade technical and organizational safeguards to protect your personal data against accidental loss, unauthorized access, alteration, and disclosure:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-zinc-600">
              <li><strong>Encryption:</strong> Data in transit is secured using modern TLS 1.3 encryption. Passwords are cryptographically hashed using salted algorithms (bcrypt).</li>
              <li><strong>Access Control:</strong> Internal access to user data is strictly role-restricted on a need-to-know basis.</li>
              <li><strong>Data Retention:</strong> We retain your personal data only for as long as is necessary to serve the purpose for which it was collected, or to comply with statutory accounting, GST, and legal record-keeping obligations. When no longer required, data is securely erased or anonymized.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">7</span>
              <h2 className="text-2xl font-bold text-zinc-900">Cookies & Tracking Technologies</h2>
            </div>
            <p className="text-sm md:text-base mb-4">
              Our website uses necessary cookies for core operations (such as preserving authentication sessions, shopping cart contents, and security tokens). We also utilize functional and analytics cookies with your consent to analyze site usage and enhance browsing performance. You can manage or revoke your cookie choices at any time through our on-site cookie preference manager.
            </p>
          </section>

          {/* Section 8: Grievance Officer */}
          <section className="bg-emerald-50/50 p-6 md:p-8 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-sm font-bold flex items-center justify-center">8</span>
              <h2 className="text-2xl font-bold text-emerald-950">Grievance Redressal Mechanism</h2>
            </div>
            <p className="text-sm md:text-base text-emerald-900 mb-6">
              In accordance with the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>Information Technology Act, 2000</strong>, we have designated a Grievance Officer to handle your privacy-related questions, access requests, or complaints.
            </p>
            
            <div className="bg-white p-6 rounded-xl border border-emerald-100 space-y-2 text-sm text-zinc-800">
              <p><strong className="text-zinc-900">Designation:</strong> Data Grievance Redressal Officer</p>
              <p><strong className="text-zinc-900">Entity:</strong> LORVEN GOLF</p>
              <p><strong className="text-zinc-900">Postal Address:</strong> Plot No. 8-1-43/1/B, Satya Colony, Qutub Shahi Tombs Road, Shaikpet, Golconda, Hyderabad, Telangana - 500008, India</p>
              <p><strong className="text-zinc-900">Email:</strong> <a href="mailto:privacy@lorvengolf.com" className="text-emerald-700 font-semibold hover:underline">privacy@lorvengolf.com</a> / <a href="mailto:support@lorvengolf.com" className="text-emerald-700 font-semibold hover:underline">support@lorvengolf.com</a></p>
              <p><strong className="text-zinc-900">Response Timeline:</strong> All privacy grievances will be acknowledged within 48 hours and addressed within 30 days of receipt.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">9</span>
              <h2 className="text-2xl font-bold text-zinc-900">Updates to This Policy</h2>
            </div>
            <p className="text-sm md:text-base">
              We may modify or revise this Privacy Policy periodically to reflect changes in our operational procedures or evolving legal mandates. The updated version will be published here with a revised &quot;Last Updated&quot; date. Continued use of our website after changes indicates your acknowledgment of the revised policy.
            </p>
          </section>

        </div>

        {/* Back navigation */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors">
            ← Return to Lorven Golf Store
          </Link>
        </div>

      </div>
    </div>
  );
}

