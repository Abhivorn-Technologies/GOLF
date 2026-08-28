import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clubs',
  description: 'Shop the best clubs at GolfPro.',
};

import CategoryHero from "@/app/(storefront)/category/_components/CategoryHero";
import ClubsSidebarFilter from "@/app/(storefront)/category/_components/ClubsSidebarFilter";
import CategoryProductGrid from "@/app/(storefront)/_components/CategoryProductGrid";
import CategorySubCategories from "@/app/(storefront)/_components/CategorySubCategories";
import BestBrandsCarousel from "@/app/(storefront)/_components/BestBrandsCarousel";
import CategoryShopByCategory from "@/app/(storefront)/_components/CategoryShopByCategory";
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClubsPage() {
  await dbConnect();
  const settings = await PageSettings.findOne({ page: 'clubs' }).lean();
  
  // Sanitize Mongoose ObjectIds for Next.js Client Component props
  const plainSettings = settings ? JSON.parse(JSON.stringify(settings)) : {};

  const bestBrands = plainSettings.bestBrands || [];
  const shopByCategory = plainSettings.shopByCategory || [];
  const subCategories = plainSettings.subCategories || [];

  return (
    <div className="min-h-screen bg-[#fbf9f9] flex flex-col font-sans">
      <main className="flex-1">
        <CategoryHero 
          title="Clubs" 
          description="Precision engineering for every shot. Discover our premium selection of golf clubs designed to elevate your game to the next level."
        />

        <div className="max-w-[1280px] mx-auto px-6 py-[48px]">
          <h2 className="text-[28px] font-serif font-semibold text-[#1b1c1c] mb-[32px]">GOLF CLUBS</h2>

          <CategorySubCategories subCategories={subCategories} />
          <BestBrandsCarousel brands={bestBrands} />
          <CategoryShopByCategory categories={shopByCategory} />

          <div className="flex gap-[32px] items-start mt-[16px]">
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
