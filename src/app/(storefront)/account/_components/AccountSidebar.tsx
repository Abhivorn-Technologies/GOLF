"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, MapPin, Package, RefreshCcw, LogOut, Heart, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { signOut, useSession } from 'next-auth/react';

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Account Info', href: '/account', icon: User },
    { name: 'My Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'My Orders', href: '/account/orders', icon: Package },
    { name: 'Returns & Cancellations', href: '/account/returns', icon: RefreshCcw },
    { name: 'Address Book', href: '/account/address', icon: MapPin },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };


  return (
    <aside className="w-full md:w-64 shrink-0 font-['Hanken_Grotesk'] mt-2">
      <div className="mb-6 flex items-center justify-between bg-white pb-4 relative">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter mb-2">
            Account
          </h2>
          <div className="flex items-center gap-4 w-full justify-between">
            <p className="text-black font-semibold text-xs tracking-widest uppercase hidden md:block">
              Welcome, {session?.user?.name?.split(' ')[0] || 'User'}
            </p>
          </div>
        </div>
        
        {/* Hamburger Menu Toggle (Mobile Only) */}
        <button 
          className="md:hidden p-2 bg-black text-white rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className={`flex-col ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex bg-white border-t-2 border-black pt-4`}>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 border-2 border-transparent group ${
                  isActive 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:border-black'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-black'}`} strokeWidth={2} />
                <span className={`text-[13px] tracking-widest uppercase font-bold`}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
