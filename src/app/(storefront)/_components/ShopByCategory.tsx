import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  { id: 1, name: 'DRIVERS', desc: 'Maximum distance Unmatched power', bg: 'bg-zinc-100' },
  { id: 2, name: 'IRONS', desc: 'Precision & control For every shot', bg: 'bg-zinc-100' },
  { id: 3, name: 'FAIRWAY WOODS', desc: 'Longer shots Better control', bg: 'bg-zinc-100' },
  { id: 4, name: 'COMPLETE SETS', desc: 'Everything you need Play complete', bg: 'bg-zinc-100' },
];

export default function ShopByCategory() {
  return (
    <div className="w-full mb-16">
      <div className="flex items-center justify-center gap-6 mb-10">
        <div className="h-px bg-[#c1c9bf] w-12"></div>
        <h2 className="text-3xl font-serif text-[#003319] tracking-wide">SHOP BY CATEGORY</h2>
        <div className="h-px bg-[#c1c9bf] w-12"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link href={`/category/${cat.name.toLowerCase()}`} key={cat.id} className="group relative block overflow-hidden rounded-2xl bg-zinc-50 border border-[#e1e4e2] aspect-[4/5] p-6 hover:shadow-lg transition-shadow">
            {/* The icon in top left */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-zinc-100 z-10 relative">
              <span className="w-2 h-2 bg-zinc-800 rounded-sm"></span>
            </div>
            
            {/* Content at top */}
            <div className="relative z-10 flex flex-col items-start justify-between h-[calc(100%-48px)]">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 font-serif leading-tight mb-2 w-2/3">{cat.name}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-snug w-3/4">{cat.desc}</p>
              </div>
              
              <div className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Faux Background Image (bottom right offset) */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-zinc-200 rounded-full blur-2xl opacity-50 group-hover:bg-green-100 transition-colors duration-500"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
