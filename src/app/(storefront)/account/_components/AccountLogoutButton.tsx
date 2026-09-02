"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AccountLogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <button 
      suppressHydrationWarning={true}
      onClick={handleLogout}
      className="flex items-center gap-2 bg-white text-red-600 border-2 border-red-600 px-6 py-2.5 font-bold text-xs tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all shadow-none"
    >
      <LogOut className="w-4 h-4" strokeWidth={2.5} />
      <span>Sign Out</span>
    </button>
  );
}
