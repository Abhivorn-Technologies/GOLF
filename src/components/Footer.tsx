import React from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Globe, Mail, Share2, ArrowRight, 
  Phone, MapPin, Clock, CreditCard, ShieldCheck, 
  Truck, RotateCcw, ChevronRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white text-zinc-600 pt-20 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Features/Trust Bar (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-16 mb-16 border-b border-gray-100">
          <div className="flex items-center gap-5 bg-[#fbf9f9] p-6 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all border border-[#c1c9bf]/30">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-green-700 shadow-sm border border-gray-100 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-zinc-900 font-bold text-base mb-1">Free Shipping</h5>
              <p className="text-zinc-500 text-sm">On orders over ₹4,999</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5 bg-[#fbf9f9] p-6 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all border border-[#c1c9bf]/30">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-green-700 shadow-sm border border-gray-100 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-zinc-900 font-bold text-base mb-1">Free Returns</h5>
              <p className="text-zinc-500 text-sm">30 days return policy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5 bg-[#fbf9f9] p-6 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all border border-[#c1c9bf]/30">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-green-700 shadow-sm border border-gray-100 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-zinc-900 font-bold text-base mb-1">Secure Payment</h5>
              <p className="text-zinc-500 text-sm">100% secure checkout</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5 bg-[#fbf9f9] p-6 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all border border-[#c1c9bf]/30">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-green-700 shadow-sm border border-gray-100 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-zinc-900 font-bold text-base mb-1">24/7 Support</h5>
              <p className="text-zinc-500 text-sm">Dedicated support team</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 flex flex-col">
            <Link href="/" className="mb-8 inline-block ml-2 md:ml-6">
              <img src="/images/golf.png" alt="LORVEN GOLF Logo" className="h-24 w-auto object-contain origin-left brightness-0" />
            </Link>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed max-w-sm">
              The ultimate destination for premium golf equipment, apparel, and accessories. Elevate your game with the best brands in the sport.
            </p>
            
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-zinc-500 hover:text-green-700 hover:bg-green-50 hover:border-green-200 transition-all group shadow-sm">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-zinc-500 hover:text-green-700 hover:bg-green-50 hover:border-green-200 transition-all group shadow-sm">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-zinc-500 hover:text-green-700 hover:bg-green-50 hover:border-green-200 transition-all group shadow-sm">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-zinc-500 hover:text-green-700 hover:bg-green-50 hover:border-green-200 transition-all group shadow-sm">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="text-zinc-900 text-sm font-bold uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-4">
              {[
                { name: 'Clubs', path: '/category/clubs' },
                { name: 'Shoes', path: '/category/shoes' },
                { name: 'Apparel', path: '/category/apparel' },
                { name: 'Bags', path: '/category/bags' },
                { name: 'Balls', path: '/category/balls' },
                { name: 'Accessories', path: '/category/accessories' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-zinc-500 hover:text-green-600 hover:translate-x-1 flex items-center gap-2 text-sm transition-all group font-medium">
                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-green-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3 md:col-span-1">
            <h4 className="text-zinc-900 text-sm font-bold uppercase tracking-wider mb-6">Support & Info</h4>
            <ul className="space-y-4">
              {[
                { name: 'My Account', path: '/account' },
                { name: 'Order Tracking', path: '/account/orders' },
                { name: 'About LORVEN GOLF', path: '/about' },
                { name: 'Shipping Policy', path: '/shipping' },
                { name: '100-Day Guarantee', path: '/guarantee' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-zinc-500 hover:text-green-600 hover:translate-x-1 flex items-center gap-2 text-sm transition-all group font-medium">
                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-green-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="text-zinc-900 text-sm font-bold uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-zinc-500 hover:text-zinc-900 transition-colors group cursor-pointer font-medium">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors mt-0.5 shrink-0" />
                <span className="text-sm leading-relaxed font-medium text-zinc-600">
                  <strong className="text-zinc-900 font-bold block mb-0.5">LORVEN GOLF</strong>
                  Plot No. 8-1-43/1/B, Satya Colony,<br/>
                  Qutub Shahi Tombs Road, Shaikpet,<br/>
                  Golconda, Hyderabad, Telangana - 500008
                </span>
              </li>
              <li className="flex items-center gap-3 text-zinc-500 hover:text-zinc-900 transition-colors group cursor-pointer font-medium">
                <Phone className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-500 hover:text-zinc-900 transition-colors group cursor-pointer font-medium">
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors shrink-0" />
                <span className="text-sm">support@lorvengolf.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-medium text-center md:text-left">
            © {new Date().getFullYear()} LORVEN GOLF. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm font-medium text-center md:text-right">
            Developed by <span className="font-bold text-black">Abhivorn Technologies Pvt Ltd</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
