"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ fallback = '/' }: { fallback?: string }) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button 
      onClick={handleBack} 
      className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black uppercase tracking-wider mb-6 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" /> Go Back
    </button>
  );
}
