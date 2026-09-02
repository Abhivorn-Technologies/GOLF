import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bags',
  description: 'Shop the best bags at GolfPro.',
};

import BrandsWeLove from "@/app/(storefront)/_components/BrandsWeLove";
import BagsSidebarFilter from "@/app/(storefront)/category/_components/BagsSidebarFilter";
import CategoryProductGrid from "@/app/(storefront)/_components/CategoryProductGrid";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function BagsCategoryPage() {
  return (
    <main className="min-h-screen bg-[#fbf9f9] flex flex-col font-sans">

      <div className="max-w-[1280px] mx-auto px-6 py-[48px] w-full">

        <BrandsWeLove category="bags" />

        <div className="flex flex-col lg:flex-row gap-[32px] items-start mt-[16px] w-full">
          <React.Suspense fallback={<div className="w-[256px] shrink-0 bg-[#fbf9f9] border border-[#c1c9bf] rounded-[16px] p-[25px] h-[500px] animate-pulse"></div>}>
            <BagsSidebarFilter />
          </React.Suspense>
          <React.Suspense fallback={<div className="flex-1 bg-white h-[500px] animate-pulse rounded-[16px]"></div>}>
            <CategoryProductGrid category="bags" />
          </React.Suspense>
        </div>
      </div>
    </main>
  );
}
