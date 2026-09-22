"use client";

import React from 'react';
import Link from 'next/link';

interface Brand {
  id: string;
  name: string;
  link: string;
  color: string;
  image?: string;
}

function resolveImgSrc(src?: string) {
  if (!src || typeof src !== 'string' || src.trim() === '' || src === '/placeholder.png' || src === 'placeholder.png' || src === 'null' || src === 'undefined') {
    return '/images/golf.png';
  }
  const clean = src.trim();
  if (clean.startsWith('data:') || clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
    return clean;
  }
  return `/images/${clean}`;
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
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-4">
        {displayBrands.map((brand) => {
          const isValidUrl = brand.link && brand.link.length > 1 && (brand.link.startsWith('/') || brand.link.startsWith('http'));
          const targetHref = isValidUrl ? brand.link : `/products?brand=${encodeURIComponent(brand.name)}`;
          return (
          <Link key={brand.id} href={targetHref} scroll={false} className="flex-1 flex flex-col group cursor-pointer">
            <div className={`w-full h-[310px] rounded-xl bg-gradient-to-br ${brand.color || 'from-gray-100 to-gray-200'} mb-4 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] border border-gray-100`}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
              {brand.image ? (
                <img 
                  src={resolveImgSrc(brand.image)} 
                  alt={brand.name} 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/golf.png'; }}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-serif italic text-sm">
                  {brand.name} Image
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center text-center">
              <h4 className="text-[15px] font-bold text-[#1b1c1c] uppercase tracking-wide mb-1 group-hover:text-[#006747] transition-colors">{brand.name}</h4>
              <span className="text-[12px] font-medium text-[#717b71] uppercase tracking-wider group-hover:text-[#006747] transition-colors pb-1 border-b border-transparent group-hover:border-[#006747]">
                {brand.link}
              </span>
            </div>
          </Link>
        )})}
      </div>
    </div>
  );
}
