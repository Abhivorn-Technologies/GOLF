import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clubs',
  description: 'Shop the best clubs at GolfPro.',
};

import ClubsSidebarFilter from "@/app/(storefront)/category/_components/ClubsSidebarFilter";
import CategoryProductGrid from "@/app/(storefront)/_components/CategoryProductGrid";
import CategorySubCategories from "@/app/(storefront)/_components/CategorySubCategories";
import BestBrandsCarousel from "@/app/(storefront)/_components/BestBrandsCarousel";
import CategoryShopByCategory from "@/app/(storefront)/_components/CategoryShopByCategory";
import { getPageSettings } from '@/lib/pageSettings';

export const dynamic = 'force-dynamic';

export default async function ClubsPage() {
  let bestBrands: any[] = [];
  let shopByCategory: any[] = [];
  let subCategories: any[] = [];

  try {
    const settings = await getPageSettings('clubs');
    if (settings) {
      bestBrands = settings.bestBrands || [];
      shopByCategory = settings.shopByCategory || [];
      subCategories = settings.subCategories || [];
    }
  } catch (e) {
    console.error("ClubsPage DB settings fetch error, using fallbacks:", e);
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9] flex flex-col font-sans">
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-6 py-[48px]">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight uppercase mb-4 text-center">GOLF CLUBS</h2>
            <div className="w-16 h-1 bg-green-600 rounded-full"></div>
          </div>

          <CategorySubCategories subCategories={subCategories} />
          <BestBrandsCarousel brands={bestBrands} />
          <CategoryShopByCategory categories={shopByCategory} />

          <div className="flex flex-col lg:flex-row gap-[32px] items-start mt-[16px] w-full">
            <React.Suspense fallback={<div className="w-[256px] h-64 bg-gray-100 animate-pulse rounded-lg" />}>
              <ClubsSidebarFilter />
            </React.Suspense>
            <React.Suspense fallback={<div className="flex-1 h-64 bg-gray-100 animate-pulse rounded-lg" />}>
              <CategoryProductGrid category="clubs" />
            </React.Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
