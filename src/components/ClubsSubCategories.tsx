"use client";

import React from 'react';

export default function ClubsSubCategories() {
  const categories = [
    { name: 'DRIVERS', id: 1 },
    { name: 'FAIRWAY WOODS', id: 2 },
    { name: 'HYBRIDS', id: 3 },
    { name: 'IRONS', id: 4 },
    { name: 'WEDGES', id: 5 },
    { name: 'CHIPPERS', id: 6 },
    { name: 'PUTTERS', id: 7 },
    { name: 'SHAFTS', id: 8 },
    { name: 'PACKAGE SETS', id: 9 },
    { name: 'UTILITY IRONS', id: 10 },
    { name: 'INDIVIDUAL IRONS', id: 11 },
    { name: 'JUNIOR INDIVIDUAL CLUB', id: 12 }
  ];

  return (
    <div className="w-full flex items-center justify-between overflow-x-auto gap-4 py-4 mb-8">
      {categories.map((cat) => (
        <div key={cat.id} className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]">
          <div className="w-[48px] h-[48px] bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center group-hover:border-[#006747] transition-colors">
            {/* Placeholder for club images */}
            <div className="w-8 h-8 bg-gray-100 rounded opacity-50 group-hover:bg-[#006747]/10" />
          </div>
          <span className="text-[10px] font-medium text-gray-700 tracking-wide text-center uppercase group-hover:text-[#006747]">
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
}
