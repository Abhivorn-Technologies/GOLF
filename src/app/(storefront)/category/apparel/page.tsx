import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apparel',
  description: 'Shop the best apparel at GolfPro.',
};

import BrandsWeLove from "@/app/(storefront)/_components/BrandsWeLove";
import ApparelBrands from "@/app/(storefront)/category/_components/ApparelBrands";
import ApparelCollections from "@/app/(storefront)/category/_components/ApparelCollections";
import ApparelSidebarFilter from "@/app/(storefront)/category/_components/ApparelSidebarFilter";
import CategoryProductGrid from "@/app/(storefront)/_components/CategoryProductGrid";
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ApparelCategoryPage() {
  await dbConnect();
  const settings = await PageSettings.findOne({ page: 'apparel' }).lean();
  const safeSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return (
    <main className="min-h-screen bg-[#fbf9f9]">
      {/* 2. Fashion Brands Showcase */}
      {safeSettings?.bestBrands?.length > 0 && (
        <ApparelBrands brands={safeSettings.bestBrands} />
      )}

      {/* 3. Featured Collections */}
      {safeSettings?.shopByCategory?.length > 0 && (
        <ApparelCollections collections={safeSettings.shopByCategory} />
      )}

      {/* 4. Main Content (Filters + Grid) */}
      <BrandsWeLove category="apparel" />

      <section className="bg-white py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[64px] flex gap-[48px] items-start mt-[32px]">
          {/* Sidebar */}
          <React.Suspense fallback={<div className="w-[256px] shrink-0 bg-[#fbf9f9] border border-[#c1c9bf] rounded-[16px] p-[25px] h-[500px] animate-pulse"></div>}>
            <ApparelSidebarFilter />
          </React.Suspense>
          
          {/* Main Product Area */}
          <React.Suspense fallback={<div className="flex-1 bg-white h-[500px] animate-pulse rounded-[16px]"></div>}>
            <CategoryProductGrid category="apparel" />
          </React.Suspense>
        </div>
      </section>
    </main>
  );
}
