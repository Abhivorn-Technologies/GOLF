"use client";

import React from 'react';
import Link from 'next/link';

interface Brand {
  id: string;
  name: string;
  link: string;
  color: string;
}

export default function BestBrandsCarousel({ brands = [] }: { brands?: Brand[] }) {
  // Fallback to defaults if not configured
  const displayBrands = brands.length > 0 ? brands : [
    { id: '1', name: 'TaylorMade', link: 'Shop Now', color: 'from-gray-100 to-gray-200' },
    { id: '2', name: 'Titleist', link: 'Shop Now', color: 'from-blue-50 to-blue-100' },
    { id: '3', name: 'Callaway', link: 'Shop Now', color: 'from-yellow-50 to-yellow-100' },
    { id: '4', name: 'Ping', link: 'Shop Now', color: 'from-slate-100 to-slate-200' },
    { id: '5', name: 'Cobra', link: 'Shop Now', color: 'from-zinc-100 to-zinc-200' }
  ];

  return (
    <div className="w-full mb-12">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase mb-4">BEST BRANDS</h2>
        <div className="w-12 h-1 bg-green-600 rounded-full"></div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {displayBrands.map((brand) => (
          <div key={brand.id} className="min-w-[220px] max-w-[240px] flex-1 flex flex-col group cursor-pointer">
            <div className={`w-full h-[310px] rounded-xl bg-gradient-to-br ${brand.color} mb-4 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] border border-gray-100`}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-serif italic text-sm">
                {brand.name} Image
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <h4 className="text-[15px] font-bold text-[#1b1c1c] uppercase tracking-wide mb-1 group-hover:text-[#006747] transition-colors">{brand.name}</h4>
              <Link href="#" className="text-[12px] font-medium text-[#717b71] uppercase tracking-wider hover:text-[#006747] transition-colors pb-1 border-b border-transparent hover:border-[#006747]">
                {brand.link}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
