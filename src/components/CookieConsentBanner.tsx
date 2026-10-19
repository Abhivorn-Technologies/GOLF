"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'lorven_cookie_consent';

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true & disabled
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Small delay so it smoothly slides in
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // localStorage may fail in private mode
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...prefs,
        timestamp: new Date().toISOString(),
      }));
    } catch (e) {}
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const full = { essential: true, analytics: true, marketing: true };
    setPreferences(full);
    saveConsent(full);
  };

  const handleEssentialOnly = () => {
    const min = { essential: true, analytics: false, marketing: false };
    setPreferences(min);
    saveConsent(min);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!mounted || !isVisible) return null;

  return (
    <div 
      role="dialog"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-gray-200">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-sm tracking-tight">Your Privacy & Cookie Choices</h3>
              <p className="text-[11px] text-zinc-500">In accordance with DPDP Act, 2023</p>
            </div>
          </div>
          <button 
            onClick={handleEssentialOnly}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors"
            title="Decline non-essential"
            aria-label="Close and decline non-essential cookies"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-600 leading-relaxed mb-4">
          We use cookies to maintain your shopping cart, ensure secure checkout, and analyze website traffic. You can customize your preferences or read our{' '}
          <Link href="/privacy" className="text-emerald-700 font-semibold underline hover:text-emerald-800">
            Privacy Policy
          </Link>.
        </p>

        {/* Preferences Toggle Section */}
        {showPreferences && (
          <div className="mb-4 pt-3 border-t border-gray-100 space-y-2.5 text-xs animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
              <div>
                <span className="font-semibold text-zinc-900 block">Strictly Necessary</span>
                <span className="text-[11px] text-zinc-500">Essential for cart, authentication, and payment security.</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Always Active
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
              <div>
                <span className="font-semibold text-zinc-900 block">Analytics & Performance</span>
                <span className="text-[11px] text-zinc-500">Helps us understand how golfers use our store to improve page speed.</span>
              </div>
              <input 
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-4 h-4 rounded text-black focus:ring-black accent-black cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
              <div>
                <span className="font-semibold text-zinc-900 block">Personalization & Deals</span>
                <span className="text-[11px] text-zinc-500">Tailors gear recommendations based on golf interests.</span>
              </div>
              <input 
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="w-4 h-4 rounded text-black focus:ring-black accent-black cursor-pointer"
              />
            </div>

          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          {showPreferences ? (
            <button
              onClick={handleSavePreferences}
              className="flex-1 bg-black text-white hover:bg-zinc-800 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              Save Preferences
            </button>
          ) : (
            <>
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-black text-white hover:bg-zinc-800 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
              >
                Accept All
              </button>
              <button
                onClick={handleEssentialOnly}
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors border border-zinc-200"
              >
                Essential Only
              </button>
            </>
          )}

          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-xs font-semibold text-zinc-600 hover:text-black py-2 px-3 rounded-xl hover:bg-zinc-100 transition-colors inline-flex items-center justify-center gap-1"
          >
            {showPreferences ? (
              <>Hide Details <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Preferences <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
