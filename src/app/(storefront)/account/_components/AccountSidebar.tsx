"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, MapPin, Package, RefreshCcw, LogOut, Heart, Menu, X, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userName = session?.user?.name || 'Customer';
  const userEmail = session?.user?.email || '';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navItems = [
    { name: 'Personal Details', href: '/account', icon: User },
    { name: 'My Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'Order History', href: '/account/orders', icon: Package },
    { name: 'Returns & Refunds', href: '/account/returns', icon: RefreshCcw },
    { name: 'Saved Addresses', href: '/account/address', icon: MapPin },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <aside className="w-full md:w-72 shrink-0 font-sans">
      
      {/* User Header Profile Card */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-700 text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0">
            {initials || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-zinc-900 text-sm truncate leading-tight">{userName}</h3>
            <span className="text-xs text-zinc-400 truncate">{userEmail}</span>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-zinc-600 hover:text-black rounded-xl hover:bg-zinc-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Card */}
      <div className={`bg-white rounded-2xl p-3 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="px-3 py-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Account Dashboard</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  isActive 
                    ? 'bg-zinc-900 text-white font-semibold shadow-sm' 
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-900'} transition-colors`} strokeWidth={2} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white/60' : 'text-zinc-300 group-hover:text-zinc-500 opacity-0 group-hover:opacity-100'} transition-all`} />
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" strokeWidth={2} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
