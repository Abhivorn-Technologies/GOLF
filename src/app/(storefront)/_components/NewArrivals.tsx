import React from 'react';
import Link from 'next/link';
import QuickAddOverlay from "@/app/(storefront)/product/_components/QuickAddOverlay";
import WishlistButton from '@/components/WishlistButton';
import ScrollReveal from '@/components/ScrollReveal';
import { ArrowRight, Sparkles } from 'lucide-react';

function resolveImg(src: string) {
  if (!src) return '/images/golf.png';
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) return src;
  return `/images/${src}`;
}

interface NewArrivalsProps {
  products?: any[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const latestProducts = products || [];

  return (
    <section className="w-full py-20 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header with Scroll Arrival Animation */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex flex-col items-center mb-14 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Just Arrived</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight uppercase mb-3">
              New Arrivals
            </h2>
            <div className="w-16 h-1 bg-green-600 rounded-full mb-3"></div>
            <p className="text-zinc-500 text-sm md:text-base max-w-lg">
              Explore the latest premium golf gear, clubs, and apparel crafted for peak performance.
            </p>
          </div>
        </ScrollReveal>

        {/* Product Cards with Staggered Scroll Arrival & Dynamic Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product, idx) => (
            <ScrollReveal key={product.id || idx} animation="fade-up" delay={idx * 120} duration={650}>
              <div className="group relative bg-white rounded-2xl p-3 border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(0,103,71,0.1),0_8px_16px_-4px_rgba(0,0,0,0.04)] hover:border-emerald-500/30 flex flex-col h-full">
                
                {/* Image Container */}
                <div className="relative h-64 w-full bg-[#f8f9fa] rounded-xl mb-4 overflow-hidden block">
                  <WishlistButton productId={product.id || product._id} />
                  
                  <Link href={`/product/${product.slug || product.id || product._id}`} className="relative w-full h-full block">
                    <img 
                      src={resolveImg(product.image || '')} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-contain p-5 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110" 
                    />
                  </Link>
                  
                  <div suppressHydrationWarning>
                    <QuickAddOverlay product={product} />
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="flex flex-col flex-grow px-2 pb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {product.brand}
                  </span>
                  <Link 
                    href={`/product/${product.slug || product.id}`} 
                    className="text-base font-bold text-zinc-900 group-hover:text-green-700 transition-colors leading-snug mb-2 line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-base font-extrabold text-zinc-900">{product.price}</span>
                    <span className="text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      View details &rarr;
                    </span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* View All CTA with Scroll Animation */}
        <ScrollReveal animation="fade-up" delay={300} duration={600}>
          <div className="mt-14 flex justify-center">
            <Link 
              href="/new-arrivals" 
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border-2 border-zinc-900 bg-transparent text-zinc-900 font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-zinc-900 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

