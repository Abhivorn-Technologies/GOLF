import React from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Globe, Mail, Share2, ArrowRight, 
  Phone, MapPin, Clock, CreditCard, ShieldCheck, 
  Truck, RotateCcw, ChevronRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] text-zinc-300 pt-20 pb-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Features/Trust Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-16 mb-16 border-b border-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-green-500 border border-zinc-800">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm">Free Shipping</h5>
              <p className="text-zinc-500 text-xs mt-1">On orders over $99</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-green-500 border border-zinc-800">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm">Free Returns</h5>
              <p className="text-zinc-500 text-xs mt-1">30 days return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-green-500 border border-zinc-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm">Secure Payment</h5>
              <p className="text-zinc-500 text-xs mt-1">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-green-500 border border-zinc-800">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm">24/7 Support</h5>
              <p className="text-zinc-500 text-xs mt-1">Dedicated support</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 flex flex-col">
            <Link href="/" className="mb-6 inline-block pl-2">
              <img src="/images/golf.png" alt="GolfPro Logo" className="h-12 w-auto object-contain scale-[1.4] origin-left brightness-0 invert" />
            </Link>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-sm">
              The ultimate destination for premium golf equipment, apparel, and accessories. Elevate your game with the best brands in the sport.
            </p>
            
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all group">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all group">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all group">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all group">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6">Shop</h4>
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
                  <Link href={link.path} className="text-zinc-400 hover:text-green-400 hover:translate-x-1 flex items-center gap-2 text-sm transition-all group">
                    <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-green-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3 md:col-span-1">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6">Support & Info</h4>
            <ul className="space-y-4">
              {[
                { name: 'My Account', path: '/account' },
                { name: 'Order Tracking', path: '/account/orders' },
                { name: 'About GolfPro', path: '/about' },
                { name: 'Shipping Policy', path: '/shipping' },
                { name: '100-Day Guarantee', path: '/guarantee' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-zinc-400 hover:text-green-400 hover:translate-x-1 flex items-center gap-2 text-sm transition-all group">
                    <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-green-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-zinc-400 hover:text-white transition-colors group cursor-pointer">
                <MapPin className="w-5 h-5 text-zinc-600 group-hover:text-green-500 transition-colors mt-0.5 shrink-0" />
                <span className="text-sm leading-relaxed">123 Fairway Drive<br/>Suite 400<br/>Scottsdale, AZ 85251</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group cursor-pointer">
                <Phone className="w-5 h-5 text-zinc-600 group-hover:text-green-500 transition-colors shrink-0" />
                <span className="text-sm">1-800-GOLF-PRO</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group cursor-pointer">
                <Mail className="w-5 h-5 text-zinc-600 group-hover:text-green-500 transition-colors shrink-0" />
                <span className="text-sm">support@golfpro.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800 flex justify-center md:justify-start items-center">
          <p className="text-zinc-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} GolfPro Inc. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
