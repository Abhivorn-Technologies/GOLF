"use client";

import React from 'react';
import Link from 'next/link';

interface SubCategory {
  id: string;
  name: string;
  image?: string;
}

export default function CategorySubCategories({ subCategories = [] }: { subCategories?: SubCategory[] }) {
  const displayCategories = subCategories.length > 0 ? subCategories : [
    { name: 'DRIVERS', id: '1' },
    { name: 'FAIRWAY WOODS', id: '2' },
    { name: 'HYBRIDS', id: '3' },
    { name: 'IRONS', id: '4' },
    { name: 'WEDGES', id: '5' },
    { name: 'CHIPPERS', id: '6' },
    { name: 'PUTTERS', id: '7' },
    { name: 'SHAFTS', id: '8' },
    { name: 'PACKAGE SETS', id: '9' },
    { name: 'UTILITY IRONS', id: '10' },
    { name: 'INDIVIDUAL IRONS', id: '11' },
    { name: 'JUNIOR INDIVIDUAL CLUB', id: '12' }
  ];

  return (
    <div className="w-full flex items-center justify-between overflow-x-auto gap-4 py-4 mb-8">
      {displayCategories.map((cat) => {
        // format DRIVERS -> Drivers
        const filterVal = cat.name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
        return (
          <Link href={`?Type=${encodeURIComponent(filterVal)}`} scroll={false} key={cat.id} className="flex flex-col items-center gap-2 group min-w-[80px]">
            <div className="w-[48px] h-[48px] bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center group-hover:border-[#006747] transition-colors overflow-hidden">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain p-1" />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded opacity-50 group-hover:bg-[#006747]/10" />
              )}
            </div>
            <span className="text-[10px] font-medium text-gray-700 tracking-wide text-center uppercase group-hover:text-[#006747]">
              {cat.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
