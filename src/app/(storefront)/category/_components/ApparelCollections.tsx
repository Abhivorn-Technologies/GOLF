import React from 'react';
import Link from 'next/link';

export default function ApparelCollections({ collections }: { collections: any[] }) {
  return (
    <section className="bg-white py-[64px] border-b border-[#c1c9bf]">
      <div className="max-w-[1280px] mx-auto px-[64px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-[40px] relative">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight uppercase mb-4 text-center">Featured Collections</h2>
          <div className="w-16 h-1 bg-green-600 rounded-full mb-6"></div>
          
          <Link href="#" className="absolute right-0 top-2 hidden md:flex items-center gap-1 group text-[#414942] hover:text-green-700 transition-colors">
             <span className="text-[14px] font-bold uppercase tracking-[1.4px]">View All</span>
             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Dynamic Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {collections.slice(0, 2).map((col, index) => {
            const filterVal = col.name?.split(' ').map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(' ') || '';
            const isValidUrl = col.href && col.href.length > 1 && (col.href.startsWith('/') || col.href.startsWith('http'));
            const targetHref = isValidUrl ? col.href : `?type=${encodeURIComponent(filterVal)}`;
            
            return (
            <Link key={index} href={targetHref} scroll={false} className="block relative h-[400px] rounded-[16px] overflow-hidden group">
              <div className="absolute inset-0 bg-zinc-200">
                {col.image ? (
                  <img src={col.image.startsWith('http') ? col.image : `/images/${col.image}`} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${col.color || 'from-gray-700 to-gray-900'} group-hover:scale-105 transition-transform duration-700`}></div>
                )}
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-[32px] left-[32px] right-[32px] flex items-end justify-between">
                <div>
                  <p className="text-[14px] font-serif font-medium text-white/80 uppercase tracking-[1.4px] mb-[8px]">{col.desc || 'Featured'}</p>
                  <h3 className="text-[32px] font-serif font-semibold text-white leading-none">{col.name}</h3>
                </div>
                <div className="w-[48px] h-[48px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#1b1c1c] transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          )})}
        </div>
      </div>
    </section>
  );
}
