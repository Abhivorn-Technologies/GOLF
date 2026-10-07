import React from 'react';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';
import ScrollReveal from '@/components/ScrollReveal';
import { ArrowRight, Flame } from 'lucide-react';

function resolveImg(src: string) {
  if (!src) return '/images/golf.png';
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) return src;
  return `/images/${src}`;
}

interface FeaturedDealsProps {
  deals?: any[];
}

export default function FeaturedDeals({ deals }: FeaturedDealsProps) {
  const dealsToDisplay = deals || [];

  return (
    <section className="w-full py-20 bg-gray-50 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex flex-col items-center mb-14 text-center relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-3 border border-red-100">
              <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Limited Time Offers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight uppercase mb-3">
              Top Deals
            </h2>
            <div className="w-16 h-1 bg-green-600 rounded-full mb-3"></div>
            <p className="text-zinc-600 text-sm md:text-base mb-4 max-w-lg">
              Dial in your game with the best deals on top equipment and apparel.
            </p>
            <Link 
              href="/sale" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 border-b-2 border-zinc-900 hover:text-green-600 hover:border-green-600 transition-all pb-0.5 uppercase tracking-wider group"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Deals Grid with Staggered Scroll Reveal & Dynamic Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dealsToDisplay.length > 0 ? (
            dealsToDisplay.map((deal, idx) => (
              <ScrollReveal key={deal.id || idx} animation="fade-up" delay={idx * 120} duration={650}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-emerald-500/30 flex flex-col group relative h-full">
                  
                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-[#f8f9fa] overflow-hidden">
                    <WishlistButton productId={deal.id || deal._id} />
                    
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm z-10">
                      {deal.discount}
                    </span>
                    
                    <Link href={`/product/${deal.slug || deal.id}`} className="w-full h-full flex items-center justify-center relative block">
                      {deal.image ? (
                        <img 
                          src={resolveImg(deal.image || '')} 
                          alt={deal.name} 
                          className="absolute inset-0 w-full h-full object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110" 
                        />
                      ) : (
                        <span className="text-zinc-400">Product Image Placeholder</span>
                      )}
                    </Link>
                  </div>
                  
                  {/* Deal Details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {deal.brand}
                    </span>
                    <Link 
                      href={`/product/${deal.slug || deal.id}`} 
                      className="text-xl font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors leading-tight mb-4 line-clamp-2"
                    >
                      {deal.name}
                    </Link>
                    
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-2xl font-black text-red-600">{deal.salePrice}</span>
                        {deal.originalPrice && (
                          <span className="text-sm text-gray-400 line-through font-medium">{deal.originalPrice}</span>
                        )}
                      </div>
                      
                      <Link 
                        href={`/product/${deal.slug || deal.id}`}
                        className="group/btn w-full bg-zinc-900 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 uppercase tracking-wider text-xs flex items-center justify-center gap-2 text-center shadow-md hover:shadow-lg active:scale-[0.98]"
                      >
                        <span>Shop Now</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500">
              Check back soon for new deals!
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
