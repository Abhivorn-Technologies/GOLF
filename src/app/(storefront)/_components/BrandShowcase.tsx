import React from 'react';

export default function BrandShowcase() {
  const brands = [
    { id: 1, name: 'Brand 1', image: 'image 30.png' },
    { id: 2, name: 'Brand 2', image: 'image 31.png' },
    { id: 3, name: 'Brand 3', image: 'image 32.png' },
    { id: 4, name: 'Brand 4', image: 'Background+Border-1.png' }, // Faux logo placeholder
  ];

  return (
    <div className="w-full bg-[#fbf9f9] border-b border-[#bec9c1] pt-[65px] pb-[97px] px-[64px]">
      <div className="max-w-[1152px] mx-auto flex flex-col items-center">
        <h2 className="text-[32px] font-bold font-serif text-[#1b1c1c] mb-[59px]">Brands</h2>
        
        <div className="flex gap-[88px] justify-center items-center flex-wrap">
          {brands.map((brand) => (
            <div key={brand.id} className="w-[127px] h-[127px] bg-white border border-[#bec9c1] rounded-[10px] flex items-center justify-center p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-[89px] h-[89px] relative flex items-center justify-center">
                 {/* Using object-contain so any logo fits nicely in the box */}
                <img src={`/images/${brand.image}`} alt={brand.name} className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
