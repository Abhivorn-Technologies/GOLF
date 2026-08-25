import React from 'react';


import BallsSidebarFilter from "@/components/BallsSidebarFilter";
import BallsProductGrid from "@/components/BallsProductGrid";

export default function BallsCategoryPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      
      
      <main className="flex-grow pt-[46px] pb-[120px]">
        <div className="max-w-[1280px] mx-auto px-[64px]">
          <div className="flex items-start gap-[48px]">
            <BallsSidebarFilter />
            <BallsProductGrid />
          </div>
        </div>
      </main>

      
    </div>
  );
}
