"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const emailValue = (formData.get('email') as string).trim();
    const passwordValue = (formData.get('password') as string).trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailValue, password: passwordValue })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid admin credentials");
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-gray-800 p-8 sm:p-10 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-900/20 rounded-full blur-[60px] pointer-events-none" />

        <Link href="/" className="absolute right-4 top-4 p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/10 z-10">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <div className="mb-8 w-full flex justify-center relative z-10">
          <div className="relative h-16 w-48 flex items-center justify-center">
            <img src="/images/golf.png" alt="GolfPro Logo" className="h-full w-full object-contain brightness-0 invert" />
          </div>
        </div>

        <div className="mb-8 text-center w-full relative z-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Secure Admin Portal</h2>
          <p className="text-gray-400 text-sm font-medium">Authorized personnel only.</p>
        </div>

        {error && (
          <div className="w-full mb-6 p-3 bg-red-900/30 text-red-400 text-sm rounded-lg text-center font-medium border border-red-900/50 relative z-10">
            {error}
          </div>
        )}

        {isMounted ? (
          <form onSubmit={handleLogin} className="w-full relative z-10" suppressHydrationWarning>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Admin Email</label>
              <input 
                name="email"
                type="email" 
                placeholder="admin@golfpro.com" 
                className="w-full px-4 py-3 rounded-lg border border-gray-800 text-white placeholder:text-gray-600 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all bg-white/5 focus:bg-black text-sm"
                required
                suppressHydrationWarning
              />
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Admin Password</label>
              <div className="relative w-full">
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-800 text-white placeholder:text-gray-600 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all bg-white/5 focus:bg-black pr-12 text-sm"
                  required
                  suppressHydrationWarning
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white focus:outline-none"
                  tabIndex={-1}
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-70 transition-colors rounded-lg py-3.5 flex items-center justify-center shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.5)]"
              suppressHydrationWarning
            >
              <span className="font-bold text-white tracking-widest uppercase text-xs">
                {loading ? "Authenticating..." : "Authorize Access"}
              </span>
            </button>
          </form>
        ) : (
          <div className="w-full h-[260px] relative z-10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
