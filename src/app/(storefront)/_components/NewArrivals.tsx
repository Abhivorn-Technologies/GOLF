import React from 'react';
import Link from 'next/link';
import QuickAddOverlay from "@/app/(storefront)/product/_components/QuickAddOverlay";
import WishlistButton from '@/components/WishlistButton';

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
    <section className="w-full py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase mb-4">New Arrivals</h2>
          <div className="w-12 h-1 bg-green-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative h-64 w-full bg-zinc-100 rounded-xl mb-4 overflow-hidden block">
                <WishlistButton productId={product.id || product._id} />
                <Link href={`/product/${product.slug || product.id || product._id}`} className="relative w-full h-full block">
                  <img src={resolveImg(product.image || '')} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply" />
                </Link>
                <div suppressHydrationWarning>
                  <QuickAddOverlay product={product} />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand}</span>
                <Link href={`/product/${product.slug || product.id}`} className="text-lg font-bold text-zinc-900 hover:text-green-600 transition-colors leading-tight mb-2">
                  {product.name}
                </Link>
                <span className="text-sm font-semibold text-zinc-600">{product.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/new-arrivals" className="px-8 py-3 rounded-full border-2 border-black text-black font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
