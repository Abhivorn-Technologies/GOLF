import React from 'react';

export default function ApparelBrands() {
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
          {/* We use placeholder blocks to represent the brand cards */}
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="aspect-square bg-white border border-[#c1c9bf] rounded-[16px] flex items-center justify-center overflow-hidden hover:shadow-md transition-shadow group">
              <div className="w-full h-full bg-zinc-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                 <span className="text-[#717b71] font-serif italic">Brand {index} Placeholder</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
