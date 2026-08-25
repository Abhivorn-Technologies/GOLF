import React from 'react';


import AccessoriesSidebarFilter from '@/components/AccessoriesSidebarFilter';
import AccessoriesProductGrid from '@/components/AccessoriesProductGrid';

export default function AccessoriesCategoryPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Global Header */}
      

      {/* 2. Main Content (Filters + Grid) */}
      <section className="bg-white py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[64px] flex gap-[32px]">
          {/* Sidebar */}
          <React.Suspense fallback={<div className="w-[256px] shrink-0 bg-[#fbf9f9] border border-[#c1c9bf] rounded-[16px] p-[25px] h-[500px] animate-pulse"></div>}>
            <AccessoriesSidebarFilter />
          </React.Suspense>
          
          {/* Main Product Area */}
          <React.Suspense fallback={<div className="flex-1 bg-white h-[500px] animate-pulse rounded-[16px]"></div>}>
            <AccessoriesProductGrid />
          </React.Suspense>
        </div>
      </section>

      {/* 3. Global Footer */}
      
    </main>
  );
}
