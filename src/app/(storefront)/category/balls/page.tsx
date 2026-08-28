import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Balls',
  description: 'Shop the best golf balls at GolfPro.',
};

import BrandsWeLove from "@/app/(storefront)/_components/BrandsWeLove";
import BallsSidebarFilter from "@/app/(storefront)/category/_components/BallsSidebarFilter";
import CategoryProductGrid from "@/app/(storefront)/_components/CategoryProductGrid";
import CategoryHero from "@/app/(storefront)/category/_components/CategoryHero";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function BallsCategoryPage() {
  return (
    <main className="min-h-screen bg-[#fbf9f9] flex flex-col font-sans">
      <CategoryHero 
        title="Balls" 
        description="Premium golf balls designed for ultimate distance, spin, and control."
      />

      <div className="max-w-[1280px] mx-auto px-6 py-[48px] w-full">
        <h2 className="text-[28px] font-serif font-semibold text-[#1b1c1c] mb-[32px]">GOLF BALLS</h2>

        <BrandsWeLove category="balls" />

        <div className="flex gap-[32px] items-start mt-[16px]">
          <React.Suspense fallback={<div className="w-[256px] shrink-0 bg-[#fbf9f9] border border-[#c1c9bf] rounded-[16px] p-[25px] h-[500px] animate-pulse"></div>}>
            <BallsSidebarFilter />
          </React.Suspense>
          <React.Suspense fallback={<div className="flex-1 bg-white h-[500px] animate-pulse rounded-[16px]"></div>}>
            <CategoryProductGrid category="balls" />
          </React.Suspense>
        </div>
      </div>
    </main>
  );
}
