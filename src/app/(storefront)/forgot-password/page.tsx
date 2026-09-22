"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSubmitted(true);
      if (data.devResetUrl) {
        setDevUrl(data.devResetUrl);
      }
      toast.success('Password reset link generated!');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      toast.error(err.message || 'Error sending reset request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f4f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 relative">
        <Link href="/login" className="absolute left-4 top-4 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100 flex items-center gap-1 text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>

        <div className="mb-8 w-full flex justify-center mt-2">
          <div className="relative w-32 h-12">
            <Image src="/images/golf.png" alt="Golf Logo" fill sizes="128px" className="object-contain" priority />
          </div>
        </div>

        {!submitted ? (
          <>
            <div className="mb-6 text-center w-full">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-2">Forgot Password</h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Enter the email address associated with your account and we’ll send you a link to reset your password.
              </p>
            </div>

            {error && (
              <div className="w-full mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative w-full">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@address.com" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white text-sm"
                    required
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black hover:bg-gray-800 disabled:opacity-70 transition-colors rounded-lg py-3.5 flex items-center justify-center mb-6 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2 font-bold text-white tracking-widest uppercase text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Link...
                  </span>
                ) : (
                  <span className="font-bold text-white tracking-widest uppercase text-xs">
                    Send Reset Link
                  </span>
                )}
              </button>

              <div className="text-center text-xs font-medium text-gray-600">
                Remember your password? <Link href="/login" className="text-black font-bold hover:underline">Sign In here</Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-2">Check Your Email</h3>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              If an account is associated with <strong className="text-black">{email}</strong>, we have sent instructions to reset your password.
            </p>

            {devUrl && (
              <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>⚡ Direct Reset Link (Ready Now):</span>
                </p>
                <a 
                  href={devUrl} 
                  className="block text-center bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors"
                >
                  Click Here To Reset Password
                </a>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => { setSubmitted(false); setDevUrl(null); }}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Try Another Email
              </button>

              <Link 
                href="/login"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
