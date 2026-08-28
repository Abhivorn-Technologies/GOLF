import React from 'react';

const subcategories = [
  { name: 'DRIVERS', id: 1, image: 'figma_img_1.png' },
  { name: 'FAIRWAY WOODS', id: 2, image: 'figma_img_2.png' },
  { name: 'HYBRIDS', id: 3, image: 'figma_img_3.png' },
  { name: 'IRONS', id: 4, image: 'figma_img_4.png' },
  { name: 'WEDGES', id: 5, image: 'figma_img_5.png' },
  { name: 'CHIPPERS', id: 6, image: 'figma_img_6.png' },
  { name: 'PUTTERS', id: 7, image: 'figma_img_7.png' },
  { name: 'SHAFTS', id: 8, image: 'figma_img_8.png' },
  { name: 'PACKAGE SETS', id: 9, image: 'figma_img_9.png' },
  { name: 'UTILITY IRONS', id: 10, image: 'figma_img_10.png' },
];

export default function SubcategoryBubbles() {
  return (
    <div className="w-full bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900">Golf Clubs</h2>
          <div className="w-10 h-1 bg-green-600 mt-4 rounded-full"></div>
        </div>
        
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide snap-x justify-start">
          {subcategories.map((sub) => (
            <div key={sub.id} className="flex flex-col items-center space-y-3 cursor-pointer group snap-start flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-zinc-100 border border-gray-200 flex items-center justify-center group-hover:border-green-500 group-hover:shadow-md transition-all relative overflow-hidden">
                <img src={`/images/${sub.image}`} alt={sub.name} className="w-full h-full object-cover p-2" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider text-center w-20 group-hover:text-green-600 transition-colors leading-tight">
                {sub.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
