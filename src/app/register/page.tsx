"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Success, redirect to login
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f4f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 relative">
        <Link href="/" className="absolute right-4 top-4 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <div className="mb-8 w-full flex justify-center">
          <div className="relative w-32 h-12">
            <Image src="/images/golf.png" alt="Golf Logo" fill sizes="128px" className="object-contain" priority />
          </div>
        </div>

        <div className="mb-6 text-center w-full">
          <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm font-medium">Sign up to shop premium golf gear.</p>
        </div>

        {error && (
          <div className="w-full mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="w-full">
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Full Name</label>
            <input 
              name="name"
              type="text" 
              placeholder="John Doe" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="email@address.com" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white text-sm"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative w-full">
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white pr-12 text-sm"
                required
                minLength={6}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 disabled:opacity-70 transition-colors rounded-lg py-3.5 flex items-center justify-center mb-6"
          >
            <span className="font-bold text-white tracking-widest uppercase text-xs">
              {loading ? "Creating..." : "Create Account"}
            </span>
          </button>

          <div className="text-center text-xs font-medium text-gray-600">
            Already have an account? <Link href="/login" className="text-black font-bold hover:underline">Sign In here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
