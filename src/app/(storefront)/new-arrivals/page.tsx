import React from 'react';
import NewArrivalsGrid from "@/app/(storefront)/new-arrivals/_components/NewArrivalsGrid";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Arrivals',
  description: 'Shop the latest premium golf equipment, clubs, apparel, and accessories at GolfPro.',
};

export default function NewArrivalsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header Area */}
      <section className="bg-gray-50 py-12 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-[64px] text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight uppercase">New Arrivals</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover the latest drops in premium golf equipment. Stay ahead of the game with our newest additions.
          </p>
        </div>
      </section>

      {/* 2. Main Content (Grid) */}
      <section className="bg-white py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[64px]">
          {/* Main Product Area */}
          <React.Suspense fallback={<div className="flex-1 bg-white h-[500px] animate-pulse rounded-[16px]"></div>}>
            <NewArrivalsGrid />
          </React.Suspense>
        </div>
      </section>
    </main>
  );
}
