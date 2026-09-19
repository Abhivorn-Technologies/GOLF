import React from 'react';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';

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
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center mb-12 text-center relative">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase mb-4">Top Deals</h2>
          <div className="w-12 h-1 bg-green-600 rounded-full mb-4"></div>
          <p className="text-zinc-600 text-lg mb-4">Dial in your game with the best deals on top equipment.</p>
          <Link href="/sale" className="text-sm font-bold text-zinc-900 border-b-2 border-zinc-900 hover:text-green-600 hover:border-green-600 transition-colors pb-1 uppercase tracking-wider">
            View All Deals
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dealsToDisplay.length > 0 ? (
            dealsToDisplay.map((deal) => (
            <div key={deal.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col group cursor-pointer block relative">
              <div className="relative w-full aspect-square bg-[#f8f9fa] overflow-hidden">
                <WishlistButton productId={deal.id || deal._id} />
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm z-10">
                  {deal.discount} OFF
                </span>
                <div className="w-full h-full flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform duration-500 relative">
                  {deal.image ? (
                    <img src={resolveImg(deal.image || '')} alt={deal.name} className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply" />
                  ) : (
                    <span>Product Image Placeholder</span>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{deal.brand}</span>
                <h3 className="text-xl font-bold text-zinc-900 leading-tight mb-4 line-clamp-2">
                  {deal.name}
                </h3>
                
                <div className="mt-auto">
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-2xl font-black text-red-600">{deal.salePrice}</span>
                    {deal.originalPrice && (
                      <span className="text-sm text-gray-400 line-through font-medium">{deal.originalPrice}</span>
                    )}
                  </div>
                  
                  <button suppressHydrationWarning className="w-full bg-zinc-900 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors duration-300 uppercase tracking-wide text-sm">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
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
