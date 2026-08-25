import React from 'react';


import CategoryHero from '@/components/CategoryHero';
import ClubsSidebarFilter from '@/components/ClubsSidebarFilter';
import ClubsProductGrid from '@/components/ClubsProductGrid';
import ClubsSubCategories from '@/components/ClubsSubCategories';
import BestBrandsCarousel from '@/components/BestBrandsCarousel';
import ClubsShopByCategory from '@/components/ClubsShopByCategory';
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export default async function ClubsPage() {
  await dbConnect();
  const settings = await PageSettings.findOne({ page: 'clubs' }).lean();

  const bestBrands = settings?.bestBrands || [];
  const shopByCategory = settings?.shopByCategory || [];

  return (
    <div className="min-h-screen bg-[#fbf9f9] flex flex-col font-sans">
      

      <main className="flex-1">
        <CategoryHero 
          title="Clubs" 
          description="Precision engineering for every shot. Discover our premium selection of golf clubs designed to elevate your game to the next level."
        />

        <div className="max-w-[1280px] mx-auto px-6 py-[48px]">
          {/* Active Filters / Results Info Area */}
          <div className="flex items-center justify-between mb-[32px]">
            <h2 className="text-[28px] font-serif font-semibold text-[#1b1c1c]">GOLF CLUBS</h2>
            <div className="flex items-center gap-[16px]">
              <span className="text-[14px] text-[#717b71]">Showing 1 - 6 of 6 results</span>
              <div className="flex items-center gap-[8px] bg-white border border-[#c1c9bf] rounded-[8px] px-[16px] py-[8px] cursor-pointer">
                <span className="text-[14px] font-medium text-[#1b1c1c]">Sort by: Featured</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#1b1c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <ClubsSubCategories />
          <BestBrandsCarousel brands={bestBrands} />
          <ClubsShopByCategory categories={shopByCategory} />

          <div className="flex gap-[32px] items-start mt-[16px]">
            <React.Suspense fallback={<div className="w-[256px] h-64 bg-gray-100 animate-pulse rounded-lg" />}>
              <ClubsSidebarFilter />
            </React.Suspense>
            <React.Suspense fallback={<div className="flex-1 h-64 bg-gray-100 animate-pulse rounded-lg" />}>
              <ClubsProductGrid />
            </React.Suspense>
          </div>
        </div>
      </main>

      
    </div>
  );
}
