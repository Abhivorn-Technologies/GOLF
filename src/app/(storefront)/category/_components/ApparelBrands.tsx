import React from 'react';
import Link from 'next/link';

export default function ApparelBrands({ brands }: { brands: any[] }) {
  return (
    <section className="bg-[#fbf9f9] py-[64px] border-b border-[#c1c9bf]">
      <div className="max-w-[1280px] mx-auto px-[64px]">
        {/* Header */}
        <div className="flex justify-center mb-[48px]">
          <div className="flex items-center gap-4">
            <h2 className="text-[36px] font-serif font-semibold text-[#1b1c1c] uppercase">Fashion Brands</h2>
            <div className="w-[40px] h-[2px] bg-[#1b1c1c] mt-[12px]"></div>
          </div>
        </div>

        {/* 4-column Image Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {brands.slice(0, 4).map((brand, index) => {
            const isValidUrl = brand.link && brand.link.length > 1 && (brand.link.startsWith('/') || brand.link.startsWith('http'));
            const targetHref = isValidUrl ? brand.link : `?brand=${encodeURIComponent(brand.name)}`;
            
            return (
            <Link href={targetHref} key={index} className="aspect-square bg-white border border-[#c1c9bf] rounded-[16px] flex items-center justify-center overflow-hidden hover:shadow-md transition-shadow group relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${brand.color || 'from-gray-100 to-gray-200'} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className="relative w-full h-full flex items-center justify-center p-8">
                {brand.image ? (
                  <img src={brand.image.startsWith('http') ? brand.image : `/images/${brand.image}`} alt={brand.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                ) : (
                  <span className="text-[#717b71] font-serif italic text-xl">{brand.name}</span>
                )}
              </div>
            </Link>
          )})}
        </div>
      </div>
    </section>
  );
}
