"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Lock, CheckCircle2, Loader2, AlertCircle, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { validatePassword } from '@/lib/validations/Password';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Live validation rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-_+=]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  if (!token || !email) {
    return (
      <div className="min-h-screen w-full bg-[#f4f4f5] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-2">Invalid Reset Link</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            This password reset link is missing required parameters or is invalid. Please request a new password reset link.
          </p>
          <Link 
            href="/forgot-password" 
            className="inline-block bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-xs uppercase tracking-wider transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Please ensure your password meets all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      toast.success('Password reset successfully!');
      
      setTimeout(() => {
        router.push('/login?resetSuccess=true');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Error resetting password. Link may have expired.');
      toast.error(err.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f4f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 relative">
        
        <div className="mb-8 w-full flex justify-center">
          <div className="relative w-32 h-12">
            <Image src="/images/golf.png" alt="Golf Logo" fill sizes="128px" className="object-contain" priority />
          </div>
        </div>

        {!success ? (
          <>
            <div className="mb-6 text-center w-full">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-2">Set New Password</h2>
              <p className="text-gray-500 text-sm font-medium">
                Resetting password for: <strong className="text-zinc-900 block mt-0.5">{email}</strong>
              </p>
            </div>

            {error && (
              <div className="w-full mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="w-full">
              {/* New Password Field */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">New Password</label>
                <div className="relative w-full">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white pr-12 text-sm"
                    required
                    minLength={8}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative w-full">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white pr-12 text-sm"
                    required
                    minLength={8}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="mb-6 p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-2">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Password Requirements:</div>
                <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0" />}
                  <span>At least 8 characters long</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
                  {hasUppercase ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0" />}
                  <span>At least 1 uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasSpecialChar ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
                  {hasSpecialChar ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0" />}
                  <span>At least 1 special character (!@#$%^&*...)</span>
                </div>
                {confirmPassword.length > 0 && (
                  <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-emerald-700 font-medium' : 'text-red-500 font-medium'}`}>
                    {passwordsMatch ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                    <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading || !hasMinLength || !hasUppercase || !hasSpecialChar || !passwordsMatch}
                className="w-full bg-black hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg py-3.5 flex items-center justify-center mb-6 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2 font-bold text-white tracking-widest uppercase text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating Password...
                  </span>
                ) : (
                  <span className="font-bold text-white tracking-widest uppercase text-xs">
                    Update Password
                  </span>
                )}
              </button>

              <div className="text-center text-xs font-medium text-gray-600">
                Cancel and return to <Link href="/login" className="text-black font-bold hover:underline">Sign In</Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-2">Password Updated!</h3>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Your password has been changed successfully. Redirecting you to the sign in page...
            </p>

            <Link 
              href="/login"
              className="w-full bg-black hover:bg-gray-800 text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center"
            >
              Go to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
