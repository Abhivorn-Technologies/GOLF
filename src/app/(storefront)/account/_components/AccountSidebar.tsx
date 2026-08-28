"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, MapPin, Package, CreditCard, LogOut, Heart, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { signOut } from 'next-auth/react';

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Account Info', href: '/account', icon: User },
    { name: 'My Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'My Orders', href: '/account/orders', icon: Package },
    { name: 'Address Book', href: '/account/address', icon: MapPin },
    { name: 'Payment Methods', href: '/account/payments', icon: CreditCard },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };


  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="mb-4 md:mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-1">
            Account
          </h2>
          <p className="text-gray-500 font-medium text-sm hidden md:block">
            Manage your preferences
          </p>
        </div>
        
        {/* Hamburger Menu Toggle (Mobile Only) */}
        <button 
          className="md:hidden p-2 rounded-xl bg-white border border-gray-200 text-black hover:bg-gray-50 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation Links - Collapsible on Mobile, always visible on Desktop */}
      <nav className={`flex-col space-y-1 ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-black text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-black font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} strokeWidth={2.5} />
              <span className={`text-sm ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-500 hover:bg-red-50 hover:text-red-600 w-full text-left font-semibold"
          >
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
            <span className="text-sm">Log Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
