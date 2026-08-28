"use client";

import React from 'react';
import Link from 'next/link';

interface SubCategory {
  id: string;
  name: string;
  image?: string;
}

export default function ClubsSubCategories({ subCategories = [] }: { subCategories?: SubCategory[] }) {
  // If no dynamic subcategories provided, fallback to placeholders for a better default experience
  const displayCategories = subCategories.length > 0 ? subCategories : [
    { id: '1', name: 'DRIVERS' },
    { id: '2', name: 'FAIRWAY WOODS' },
    { id: '3', name: 'HYBRIDS' },
    { id: '4', name: 'IRONS' },
    { id: '5', name: 'WEDGES' },
    { id: '6', name: 'CHIPPERS' },
    { id: '7', name: 'PUTTERS' },
    { id: '8', name: 'SHAFTS' },
    { id: '9', name: 'PACKAGE SETS' },
    { id: '10', name: 'UTILITY IRONS' },
    { id: '11', name: 'INDIVIDUAL IRONS' },
    { id: '12', name: 'JUNIOR INDIVIDUAL CLUB' },
  ];

  return (
    <div className="w-full overflow-x-auto pb-4 mb-16 no-scrollbar">
      <div className="flex gap-[32px] min-w-max">
        {displayCategories.map((cat) => {
          const filterVal = cat.name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
          
          return (
            <Link 
              href={`?Type=${encodeURIComponent(filterVal)}`}
              key={cat.id} 
              className="flex flex-col items-center gap-[16px] group cursor-pointer"
            >
              <div className="w-[88px] h-[88px] bg-white border border-[#c1c9bf] rounded-[16px] flex items-center justify-center overflow-hidden group-hover:border-[#006747] transition-colors shadow-sm">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-[64px] h-[64px] object-contain group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <div className="w-[56px] h-[56px] bg-[#f4f6f4] rounded-[8px]"></div>
                )}
              </div>
              <span className="text-[12px] font-bold text-[#414942] uppercase tracking-wider group-hover:text-[#006747] transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
