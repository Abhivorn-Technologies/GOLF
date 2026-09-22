"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || searchParams.get('callbackUrl') || '';

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get('email') as string;
    const passwordValue = formData.get('password') as string;

    try {
      const res = await signIn('credentials', {
        email: emailValue,
        password: passwordValue,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        // Fetch session to check role
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        if (session?.user?.role === 'admin') {
          router.push('/admin');
        } else if (redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')) {
          router.push(redirectTarget);
        } else {
          router.push('/account');
        }
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
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
          <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-2">Customer Login</h2>
          <p className="text-gray-500 text-sm font-medium">Welcome back. Sign in to your account.</p>
        </div>

        {searchParams.get('resetSuccess') && (
          <div className="w-full mb-6 p-3 bg-emerald-50 text-emerald-800 text-sm rounded-lg text-center font-medium border border-emerald-200">
            Password reset successful! Please sign in with your new password.
          </div>
        )}

        {searchParams.get('registered') && (
          <div className="w-full mb-6 p-3 bg-emerald-50 text-emerald-800 text-sm rounded-lg text-center font-medium border border-emerald-200">
            Account created successfully! Please sign in.
          </div>
        )}

        {error && (
          <div className="w-full mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">Password</label>
              <Link 
                href="/forgot-password" 
                className="text-xs text-zinc-500 hover:text-black font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative w-full">
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white pr-12 text-sm"
                required
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
              {loading ? "Signing In..." : "Sign In"}
            </span>
          </button>

          <div className="text-center text-xs font-medium text-gray-600">
            Don't have an account? <Link href={redirectTarget ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : "/register"} className="text-black font-bold hover:underline">Create one here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
