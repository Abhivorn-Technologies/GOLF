import React from 'react';


import BrandShowcase from "@/components/BrandShowcase";
import ShoesSidebarFilter from "@/components/ShoesSidebarFilter";
import ShoesProductGrid from "@/components/ShoesProductGrid";

export default function ShoesCategoryPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      
      <main className="flex-grow">
        {/* Section 1: Brand Showcase */}
        <BrandShowcase />

        {/* Section 2: Main Content */}
        <div className="bg-[#fbf9f9] pt-[58px] pb-[120px]">
          <div className="max-w-[1280px] mx-auto px-[64px]">
            
            {/* Section Header */}
            <div className="flex items-end justify-between border-b border-[#c1c9bf] pb-[25px] mb-[48px]">
              <div>
                <p className="text-[12px] font-serif font-medium uppercase tracking-[1.2px] text-[#414942] mb-[7.5px]">NEW COLLECTION</p>
                <h2 className="text-[36px] font-serif font-semibold text-[#1b1c1c] leading-none">Trending Footwear</h2>
              </div>
              <button className="flex items-center gap-1 group text-[#414942] hover:text-green-700 transition-colors">
                <span className="text-[14px] font-serif font-medium uppercase tracking-[1.4px]">VIEW ALL</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* Sidebar + Grid */}
            <div className="max-w-[1280px] mx-auto px-[64px] flex gap-[32px]">
          {/* Sidebar */}
          <React.Suspense fallback={<div className="w-[256px] shrink-0 bg-[#fbf9f9] border border-[#c1c9bf] rounded-[16px] p-[25px] h-[500px] animate-pulse"></div>}>
            <ShoesSidebarFilter />
          </React.Suspense>
          
          {/* Main Product Area */}
          <React.Suspense fallback={<div className="flex-1 bg-white h-[500px] animate-pulse rounded-[16px]"></div>}>
            <ShoesProductGrid />
          </React.Suspense>
        </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
