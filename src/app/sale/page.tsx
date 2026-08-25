import React from 'react';
import SaleProductGrid from '@/components/SaleProductGrid';
import Link from 'next/link';

export default function SalePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header Area */}
      <section className="bg-gray-50 py-12 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-[64px] text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight uppercase">Clearance & Sale</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Shop the best deals on premium golf equipment. Quantities are limited, so grab your gear before it's gone.
          </p>
        </div>
      </section>

      {/* 2. Main Content (Grid) */}
      <section className="bg-white py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[64px]">
          {/* Main Product Area */}
          <React.Suspense fallback={<div className="flex-1 bg-white h-[500px] animate-pulse rounded-[16px]"></div>}>
            <SaleProductGrid />
          </React.Suspense>
        </div>
      </section>
    </main>
  );
}
