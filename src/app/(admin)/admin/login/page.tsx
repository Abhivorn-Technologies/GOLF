"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-[#f4f4f5]">
      
      {/* Monochrome Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-black/10 mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gray-400/20 mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-slate-800/10 mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-gray-300/40 mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '3s' }}></div>
      </div>

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-lg z-10 p-4 sm:p-0">
        
        {/* Animated Border Wrapper */}
        <div className="relative group rounded-3xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 via-black to-gray-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
          
          {/* Main Glassmorphic Card */}
          <div className="relative backdrop-blur-2xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl overflow-hidden p-8 sm:p-12">
            
            <Link href="/" className="absolute right-6 top-6 p-2 text-gray-400 hover:text-black transition-all duration-300 rounded-full hover:bg-black/5 z-20">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <div className="mb-10 w-full flex flex-col items-center relative z-10">
              <div className="relative w-40 h-16 flex items-center justify-center mb-4">
                <Image src="/images/golf.png" alt="GolfPro Logo" fill sizes="160px" className="object-contain drop-shadow-sm" priority />
              </div>
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-600 to-black tracking-tight mb-2 text-center drop-shadow-sm">
                Admin Portal
              </h2>
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                Secure access to Lorven Golf systems.
              </p>
            </div>

            {error && (
              <div className="w-full mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-xl text-center font-bold border border-red-100 flex items-center justify-center gap-2 backdrop-blur-md">
                <ShieldAlert className="w-5 h-5" />
                {error}
              </div>
            )}

            {isMounted ? (
              <form onSubmit={handleLogin} className="w-full space-y-6 relative z-10" suppressHydrationWarning>
                <div className="space-y-2 relative group/input">
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within/input:text-black transition-colors" />
                    </div>
                    <input 
                      name="email"
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/50 text-black placeholder:text-gray-400 focus:outline-none focus:border-black/30 focus:ring-2 focus:ring-black/10 transition-all bg-white/50 focus:bg-white shadow-inner backdrop-blur-sm font-medium"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div className="space-y-2 relative group/input">
                  <div className="flex justify-between items-center pr-1">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1">Password</label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within/input:text-black transition-colors" />
                    </div>
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full pl-12 pr-12 py-4 rounded-xl border border-white/50 text-black placeholder:text-gray-400 focus:outline-none focus:border-black/30 focus:ring-2 focus:ring-black/10 transition-all bg-white/50 focus:bg-white shadow-inner backdrop-blur-sm font-medium"
                      required
                      suppressHydrationWarning
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 bottom-0 px-4 text-gray-400 hover:text-black transition-colors focus:outline-none flex items-center justify-center"
                      tabIndex={-1}
                      suppressHydrationWarning
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="relative w-full group overflow-hidden rounded-xl disabled:opacity-50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                    suppressHydrationWarning
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                    {/* Shimmer effect inside button */}
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                    
                    <div className="relative w-full px-8 py-4 flex items-center justify-center">
                      <span className="font-extrabold text-white tracking-widest uppercase text-xs flex items-center gap-2">
                        {loading ? "Authenticating..." : "Sign In to Dashboard"}
                        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                      </span>
                    </div>
                  </button>
                </div>
              </form>
            ) : (
              <div className="w-full h-[280px] flex items-center justify-center relative z-10">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,0,0,0.1)]"></div>
              </div>
            )}
            
          </div>
        </div>
      </div>
      
      {/* Global styles for animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(50%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 10s ease infinite;
        }
      `}} />
    </div>
  );
}
