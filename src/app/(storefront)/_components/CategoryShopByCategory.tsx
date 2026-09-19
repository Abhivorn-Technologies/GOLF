"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  desc: string;
  href: string;
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

export default function CategoryShopByCategory({ categories = [] }: { categories?: Category[] }) {
  const displayCategories = categories.length > 0 ? categories : [
    { 
      id: '1',
      name: 'DRIVERS', 
      desc: 'Maximum distance\nUnmatched power', 
      href: '/category/clubs?type=Drivers',
      color: 'from-blue-500/20 to-blue-900/40' 
    },
    { 
      id: '2',
      name: 'IRONS', 
      desc: 'Precision & control\nFor every shot', 
      href: '/category/clubs?type=Irons',
      color: 'from-zinc-500/20 to-zinc-900/40' 
    },
    { 
      id: '3',
      name: 'FAIRWAY WOODS', 
      desc: 'Longer shots\nBetter control', 
      href: '/category/clubs?type=Fairway+Woods',
      color: 'from-emerald-500/20 to-emerald-900/40' 
    },
    { 
      id: '4',
      name: 'COMPLETE SETS', 
      desc: 'Everything you need\nPlay complete', 
      href: '/category/clubs?type=Complete+Sets',
      color: 'from-purple-500/20 to-purple-900/40' 
    }
  ];

  return (
    <div className="w-full mb-20">
      <div className="flex items-center justify-center mb-12 gap-4">
        <div className="w-8 md:w-16 h-[2px] bg-[#6cb42c]"></div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black font-serif tracking-wider uppercase">
          SHOP BY CATEGORY
        </h2>
        <div className="w-8 md:w-16 h-[2px] bg-[#6cb42c]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCategories.map((cat) => {
          
          // Automatically generate a filter link if the admin didn't provide a custom URL
          const filterVal = cat.name?.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ') || '';
          const targetHref = (cat.href && cat.href.trim() !== '') ? cat.href : `?type=${encodeURIComponent(filterVal)}`;

          // Format description for natural breaking if it doesn't already have newlines
          let formattedDesc = cat.desc || '';
          if (formattedDesc && !formattedDesc.includes('\n')) {
             // Basic heuristic to break at uppercase letters if missing newlines
             formattedDesc = formattedDesc.replace(/([a-z])([A-Z])/g, '$1\n$2');
          }

          return (
          <Link key={cat.id} href={targetHref} scroll={false} className="group relative h-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-row p-6 hover:border-[#004f32] transition-all duration-300 hover:shadow-xl">
            
            {/* Left Content */}
            <div className="relative z-10 w-[55%] flex flex-col h-full">
              <div className="w-8 h-8 bg-[#114028] rounded-full flex items-center justify-center text-white font-serif mb-6 shadow-sm">
                <span className="text-xs font-medium">{cat.name?.charAt(0) || 'C'}</span>
              </div>
              
              <h3 className="text-lg font-extrabold text-black uppercase font-serif tracking-wide mb-2 group-hover:text-[#114028] transition-colors leading-tight">
                {cat.name}
              </h3>
              
              <div className="text-[12px] text-gray-500 font-serif leading-snug mb-auto whitespace-pre-line">
                {formattedDesc}
              </div>
              
              <div className="mt-auto">
                <div className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center group-hover:border-[#114028] transition-colors">
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#114028] transition-colors" />
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="absolute right-0 bottom-4 w-[55%] h-[75%] flex items-end justify-end pointer-events-none z-0">
              {cat.image ? (
                <img 
                  src={resolveImgSrc(cat.image)} 
                  alt={cat.name} 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/golf.png'; }}
                  className="w-full h-full object-contain object-right-bottom group-hover:scale-110 transition-transform duration-500" 
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${cat.color || 'from-gray-100 to-gray-200'} opacity-20 rounded-l-full`}></div>
              )}
            </div>

          </Link>
        )})}
      </div>
    </div>
  );
}
