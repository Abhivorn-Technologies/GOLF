import React from 'react';
import Link from 'next/link';
import { FileText, ShoppingBag, ShieldAlert, CreditCard, RotateCcw, Scale } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions | LORVEN GOLF',
  description: 'Terms and conditions governing the use of the Lorven Golf website, product purchases, payments, returns, and warranties.',
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "October 19, 2026";

  return (
    <div className="bg-[#fafaf9] min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200/80 shadow-sm mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <FileText className="w-4 h-4 text-zinc-700" />
            Legal Agreement
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-zinc-900 tracking-tight mb-4">
            Terms and Conditions
          </h1>
          <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
            Welcome to <strong className="text-zinc-900">LORVEN GOLF</strong>. These Terms and Conditions govern your access to and use of our website, product purchases, and customer services.
          </p>
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-4">
            <span>Last Updated: <strong className="text-zinc-700">{lastUpdated}</strong></span>
            <span>Governing Law: <strong className="text-zinc-700">Laws of the Republic of India</strong></span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200/80 shadow-sm space-y-12 text-zinc-700 leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">1</span>
              <h2 className="text-2xl font-bold text-zinc-900">Acceptance of Terms</h2>
            </div>
            <p className="text-sm md:text-base">
              By accessing, browsing, registering an account, or placing an order on <strong className="text-zinc-900">LORVEN GOLF</strong>, you agree to be bound by these Terms and Conditions along with our <Link href="/privacy" className="text-emerald-700 font-semibold hover:underline">Privacy Policy</Link>, <Link href="/shipping" className="text-emerald-700 font-semibold hover:underline">Shipping Policy</Link>, and <Link href="/guarantee" className="text-emerald-700 font-semibold hover:underline">100-Day Guarantee Policy</Link>. If you do not agree, please do not use this website.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">2</span>
              <h2 className="text-2xl font-bold text-zinc-900">Account Registration & Security</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              To place orders and access certain features, you may be required to create an account. You represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-zinc-600 mb-4">
              <li>You are at least 18 years old or are accessing the platform under parental/guardian supervision.</li>
              <li>All information provided during registration (name, email, delivery address) is accurate, current, and complete.</li>
              <li>You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
            </ul>
            <p className="text-sm md:text-base">
              We reserve the right to suspend or terminate accounts that provide fraudulent information or violate these Terms.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">3</span>
              <h2 className="text-2xl font-bold text-zinc-900">Product Information & Pricing</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              We strive to display product specifications, golf equipment details, images, and prices as accurately as possible. However:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-zinc-600">
              <li>All prices are listed in Indian Rupees (₹ INR) and include applicable taxes (GST) unless specified otherwise.</li>
              <li>We reserve the right to correct any typographical errors, inaccuracies, or omissions in pricing or product descriptions without prior notice.</li>
              <li>In the rare event of a pricing or inventory discrepancy, we reserve the right to cancel or refuse an affected order, promptly refunding any amount charged.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">4</span>
              <h2 className="text-2xl font-bold text-zinc-900">Payments, Invoicing & Orders</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              Payments are processed securely via accredited third-party payment gateways (including Razorpay, supporting Credit/Debit Cards, UPI, Net Banking, and Wallets):
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-zinc-600">
              <li>An order is confirmed only upon successful receipt of payment and authorization from the payment gateway.</li>
              <li>We will issue a valid GST invoice with your order upon dispatch and make it available in your digital account order history.</li>
              <li>We do not store your sensitive financial information (such as complete credit card numbers or UPI PINs).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">5</span>
              <h2 className="text-2xl font-bold text-zinc-900">Returns, Replacements & Refunds</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              We stand behind the quality of our premium golf gear:
            </p>
            <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 space-y-3 text-sm md:text-base">
              <p>
                <strong>30-Day Return Window:</strong> Eligible, unused items in original condition with intact packaging, tags, and accessories may be returned within 30 days of delivery.
              </p>
              <p>
                <strong>Return Process:</strong> Customers can submit return requests directly via <Link href="/account/returns" className="text-emerald-700 font-semibold hover:underline">My Account → Returns</Link>.
              </p>
              <p>
                <strong>Refunds:</strong> Once the returned item is inspected and approved at our facility, the refund will be credited back to your original payment method within 5–7 business days.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">6</span>
              <h2 className="text-2xl font-bold text-zinc-900">Acceptable Use & Prohibited Activities</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              When using this website, you agree that you will not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-zinc-600">
              <li>Use the site for any unlawful, fraudulent, or unauthorized purpose.</li>
              <li>Attempt to disrupt, breach, compromise, or inject harmful malicious code into the platform infrastructure.</li>
              <li>Engage in automated scraping, data extraction, or indexing without our express written consent.</li>
              <li>Impersonate any individual, customer, or entity.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">7</span>
              <h2 className="text-2xl font-bold text-zinc-900">Intellectual Property Rights</h2>
            </div>
            <p className="text-sm md:text-base">
              All content on this website—including but not limited to text, graphics, logos, product photographs, digital icons, layout designs, and code—is the property of <strong>LORVEN GOLF</strong> or its respective brand partners/licensors and is protected by Indian and international copyright and trademark laws. You may not reproduce, modify, or distribute any material without express written authorization.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">8</span>
              <h2 className="text-2xl font-bold text-zinc-900">Limitation of Liability</h2>
            </div>
            <p className="text-sm md:text-base mb-3">
              To the fullest extent permitted by applicable Indian law:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-zinc-600">
              <li><strong>LORVEN GOLF</strong> shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from the use or inability to use our products or services.</li>
              <li>Our aggregate liability for any claim arising out of or related to an order shall not exceed the actual amount paid by you for the specific product giving rise to the claim.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">9</span>
              <h2 className="text-2xl font-bold text-zinc-900">Governing Law & Dispute Resolution</h2>
            </div>
            <p className="text-sm md:text-base mb-4">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any legal dispute, controversy, or claim arising out of or relating to your use of this website or orders shall be subject to the exclusive jurisdiction of the competent courts in <strong>Hyderabad, Telangana, India</strong>.
            </p>
          </section>

          {/* Section 10 */}
          <section className="bg-zinc-50 p-6 md:p-8 rounded-2xl border border-zinc-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">10</span>
              <h2 className="text-2xl font-bold text-zinc-900">Contact Us</h2>
            </div>
            <p className="text-sm md:text-base text-zinc-600 mb-4">
              If you have any questions or require clarifications regarding these Terms and Conditions, please contact our support desk:
            </p>
            <div className="space-y-1 text-sm text-zinc-800">
              <p><strong className="text-zinc-900">Store Name:</strong> LORVEN GOLF</p>
              <p><strong className="text-zinc-900">Address:</strong> Plot No. 8-1-43/1/B, Satya Colony, Qutub Shahi Tombs Road, Shaikpet, Golconda, Hyderabad, Telangana - 500008</p>
              <p><strong className="text-zinc-900">Email:</strong> <a href="mailto:support@lorvengolf.com" className="text-emerald-700 font-semibold hover:underline">support@lorvengolf.com</a></p>
              <p><strong className="text-zinc-900">Phone:</strong> +91 98765 43210</p>
            </div>
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

