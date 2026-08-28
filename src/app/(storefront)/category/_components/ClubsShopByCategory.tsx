"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  desc: string;
  href: string;
  color: string;
  image?: string;
}

export default function ClubsShopByCategory({ categories = [] }: { categories?: Category[] }) {
  const displayCategories = categories.length > 0 ? categories : [
    { 
      id: '1',
      name: 'DRIVERS', 
      desc: 'Maximum distance Unmatched power', 
      href: '/category/clubs?type=Drivers',
      color: 'from-blue-500/20 to-blue-900/40' 
    },
    { 
      id: '2',
      name: 'IRONS', 
      desc: 'Precision & control For every shot', 
      href: '/category/clubs?type=Irons',
      color: 'from-zinc-500/20 to-zinc-900/40' 
    },
    { 
      id: '3',
      name: 'FAIRWAY WOODS', 
      desc: 'Longer shots Better control', 
      href: '/category/clubs?type=Fairway+Woods',
      color: 'from-emerald-500/20 to-emerald-900/40' 
    },
    { 
      id: '4',
      name: 'COMPLETE SETS', 
      desc: 'Everything you need Play complete', 
      href: '/category/clubs?type=Complete+Sets',
      color: 'from-purple-500/20 to-purple-900/40' 
    }
  ];

  return (
    <div className="w-full mb-16">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase mb-4">SHOP BY CATEGORY</h2>
        <div className="w-12 h-1 bg-green-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCategories.map((cat) => {
          
          // Automatically generate a filter link if the admin didn't provide a custom URL
          const filterVal = cat.name?.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ') || '';
          const targetHref = (cat.href && cat.href.trim() !== '') ? cat.href : `?type=${encodeURIComponent(filterVal)}`;

          return (
          <Link key={cat.id} href={targetHref} scroll={false} className="group relative h-[320px] rounded-2xl overflow-hidden bg-zinc-100 flex flex-col justify-end p-6 border border-gray-200 transition-all duration-300 hover:border-[#006747] hover:shadow-lg">
            
            <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-zinc-400 group-hover:text-[#006747] transition-colors z-10">
              <span className="font-bold text-lg">{cat.name?.charAt(0) || 'C'}</span>
            </div>

            {cat.image ? (
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 z-0" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color || 'from-gray-200 to-gray-300'} opacity-40 group-hover:opacity-60 transition-opacity duration-300 z-0`}></div>
            )}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-0"></div>

            <div className="relative z-20 flex justify-between items-end bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/50 group-hover:bg-white transition-colors">
              <div className="flex-1 pr-2">
                <h3 className="text-xl font-bold text-[#1b1c1c] uppercase tracking-tight mb-1 group-hover:text-[#006747] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#717b71] font-medium leading-snug">{cat.desc}</p>
              </div>
              <div className="bg-zinc-100 p-2 shrink-0 rounded-full text-zinc-400 group-hover:bg-[#006747] group-hover:text-white transition-all transform group-hover:rotate-12 group-hover:scale-110 shadow-sm">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        )})}
      </div>
    </div>
  );
}
