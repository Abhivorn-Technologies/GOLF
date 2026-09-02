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
    <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto gap-2 md:gap-4 py-4 mb-8 hide-scrollbar">
      {displayCategories.map((cat) => {
        // format DRIVERS -> Drivers
        const filterVal = cat.name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
        return (
          <Link href={`?Type=${encodeURIComponent(filterVal)}`} scroll={false} key={cat.id} className="flex flex-col items-center gap-3 group">
            <div className="w-[80px] h-[80px] bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center group-hover:border-[#006747] group-hover:shadow-md transition-all overflow-hidden">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded opacity-50 group-hover:bg-[#006747]/10 transition-colors" />
              )}
            </div>
            <span className="text-[11px] font-bold text-gray-800 tracking-wide text-center uppercase group-hover:text-[#006747] transition-colors">
              {cat.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
