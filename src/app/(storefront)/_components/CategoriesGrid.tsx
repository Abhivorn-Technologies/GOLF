"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface CategoriesGridProps {
  categories?: { name: string; image: string | null }[];
}

function resolveImgSrc(src?: string | null) {
  if (!src || typeof src !== 'string' || src.trim() === '' || src === 'placeholder.png' || src === '/placeholder.png' || src === 'null' || src === 'undefined') {
    return '/images/golf.png';
  }
  const clean = src.trim();
  if (clean.startsWith('data:') || clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
    return clean;
  }
  return `/images/${clean}`;
}

import ScrollReveal from '@/components/ScrollReveal';

export default function CategoriesGrid({ categories: passedCategories }: CategoriesGridProps) {
  // Use passed categories, or fallback to empty
  const categories = passedCategories && passedCategories.length > 0
    ? passedCategories
    : ['Clubs', 'Shoes', 'Apparel', 'Accessories', 'Bags', 'Balls'].map(f => ({ name: f, image: null }));

  // Predefined subtitles for common categories for better UI, otherwise generic
  const getSubtitle = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'clubs': return 'Drivers, Irons & Putters';
      case 'shoes': return 'Performance & Comfort';
      case 'apparel': return 'Shirts, Pants & More';
      case 'accessories': return 'Rangefinders & Tees';
      case 'bags': return 'Cart & Stand Bags';
      case 'balls': return 'Tour & Distance Balls';
      default: return `Explore ${cat}`;
    }
  };

  return (
    <section className="w-full py-20 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="mb-14 max-w-2xl mx-auto text-center flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-3">
              Browse Categories
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight uppercase mb-3">
              All Categories
            </h2>
            <div className="w-16 h-1 bg-green-600 rounded-full mb-3"></div>
            <p className="text-zinc-600 text-sm md:text-base font-medium">
              Find exactly what your game needs from our curated golf selections.
            </p>
          </div>
        </ScrollReveal>

        {/* Categories Grid with Staggered Scroll Reveal & Dynamic Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 100} duration={650}>
              <Link 
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                className="group relative h-[360px] rounded-2xl overflow-hidden bg-zinc-100 flex flex-col justify-end p-6 border border-gray-200 transition-all duration-300 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 block"
              >
                {/* Category Icon / Placeholder */}
                <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-zinc-600 group-hover:text-emerald-700 group-hover:scale-110 transition-all duration-300 z-10 border border-gray-100">
                  <span className="font-extrabold text-lg">{category.name.charAt(0).toUpperCase()}</span>
                </div>

                {/* Subtle Gradient Overlay on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-15 bg-gradient-to-t from-emerald-950 via-zinc-900 to-transparent transition-opacity duration-300 z-10"></div>
                
                {/* Background Image Area */}
                <div className="absolute inset-0 z-0 p-8 flex items-center justify-center">
                  <img 
                    src={resolveImgSrc(category.image)} 
                    alt={category.name} 
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/golf.png'; }}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110" 
                  />
                </div>

                {/* Bottom Card Title Info */}
                <div className="relative z-20 flex justify-between items-end bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-0.5 group-hover:text-emerald-700 transition-colors">
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">{getSubtitle(category.name)}</p>
                  </div>
                  <div className="bg-zinc-100 p-2.5 rounded-full text-zinc-500 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-45 group-hover:scale-110 shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
