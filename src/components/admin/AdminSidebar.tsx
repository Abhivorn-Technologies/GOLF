"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Image as ImageIcon, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Brands', href: '/admin/brands', icon: ImageIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <aside 
      className={`${isCollapsed ? 'w-[80px]' : 'w-[240px]'} bg-white border-r border-gray-200 flex-col hidden md:flex h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 transition-all duration-300 relative`}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white border border-gray-200 text-gray-500 hover:text-green-600 rounded-full p-1 shadow-sm z-30"
        suppressHydrationWarning
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo Area */}
      <div className="h-[100px] flex items-center justify-center border-b border-gray-100 px-0 overflow-hidden bg-white">
        <Link href="/admin" className={`relative w-full ${isCollapsed ? 'h-[40px]' : 'h-[80px]'} block hover:opacity-80 transition-all duration-300`}>
          <Image 
            src="/images/golf.png" 
            alt="Golf Logo" 
            fill 
            className={`object-contain ${isCollapsed ? 'object-center p-2' : 'object-center p-0 scale-110'}`}
            priority
          />
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-8 px-3 space-y-2 custom-scrollbar overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-black text-white font-semibold shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-black font-medium'
              } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              title={isCollapsed ? item.name : ""}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} strokeWidth={isActive ? 2.5 : 2} />
              {!isCollapsed && <span className="text-[15px] whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
        <button 
          onClick={handleSignOut}
          className={`flex items-center gap-3 px-3 py-3.5 w-full text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group text-left ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          title={isCollapsed ? "Sign Out" : ""}
          suppressHydrationWarning
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-red-400 group-hover:text-red-600 transition-colors" />
          {!isCollapsed && <span className="text-[15px] whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
