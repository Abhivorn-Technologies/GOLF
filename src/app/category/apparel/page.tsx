import React from 'react';


import ApparelBrands from '@/components/ApparelBrands';
import ApparelCollections from '@/components/ApparelCollections';
import ApparelSidebarFilter from '@/components/ApparelSidebarFilter';
import ApparelProductGrid from '@/components/ApparelProductGrid';

export default function ApparelCategoryPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Global Header */}
      

      {/* 2. Fashion Brands Showcase */}
      <ApparelBrands />

      {/* 3. Featured Collections */}
      <ApparelCollections />

      {/* 4. Main Content (Filters + Grid) */}
      <section className="bg-white py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[64px] flex gap-[48px] items-start mt-[32px]">
          {/* Sidebar */}
          <React.Suspense fallback={<div className="w-[256px] shrink-0 bg-[#fbf9f9] border border-[#c1c9bf] rounded-[16px] p-[25px] h-[500px] animate-pulse"></div>}>
            <ApparelSidebarFilter />
          </React.Suspense>
          
          {/* Main Product Area */}
          <React.Suspense fallback={<div className="flex-1 bg-white h-[500px] animate-pulse rounded-[16px]"></div>}>
            <ApparelProductGrid />
          </React.Suspense>
        </div>
      </section>

      {/* 5. Global Footer */}
      
    </main>
  );
}
