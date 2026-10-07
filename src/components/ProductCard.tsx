'use client';

import React from 'react';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';

export default function ProductCard({ product }: { product: any }) {
  let discountBadge = null;
  if (product.numericCompareAtPrice && product.numericPrice && product.numericCompareAtPrice > product.numericPrice) {
    const discountPercent = Math.round(((product.numericCompareAtPrice - product.numericPrice) / product.numericCompareAtPrice) * 100);
    discountBadge = `${discountPercent}% OFF`;
  } else if (product.compareAtPriceStr) {
    discountBadge = 'SALE';
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(0,103,71,0.12),0_8px_16px_-4px_rgba(0,0,0,0.04)] hover:border-emerald-500/30 group cursor-pointer flex flex-col h-full relative overflow-hidden">
      <WishlistButton productId={product._id || product.id} />
      
      {/* Sale Badge */}
      {discountBadge && (
        <div className="absolute top-5 left-5 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-sm z-10">
          {discountBadge}
        </div>
      )}
      
      {/* Product Image Area */}
      <Link href={`/product/${product.slug || product.id}`} className="w-full aspect-[4/3] bg-[#f8f9fa] rounded-xl mb-5 overflow-hidden relative flex items-center justify-center block">
        {/* Fallback styling when image is missing */}
        <div className="w-full h-full flex items-center justify-center">
          {(() => {
            const rawImg = product.image || (Array.isArray(product.images) ? product.images[0] : null) || '';
            const imgSrc = !rawImg ? '/images/golf.png' : (rawImg.startsWith('http') || rawImg.startsWith('data:') || rawImg.startsWith('/') ? rawImg : `/images/${rawImg}`);
            return (
              <img 
                src={imgSrc} 
                alt={product.name || product.title || 'Product'} 
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/golf.png'; }}
                className="w-full h-full object-contain p-4 mix-blend-multiply opacity-95 group-hover:scale-110 transition-transform duration-700 ease-out" 
              />
            );
          })()}
        </div>
      </Link>
      
      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px] mb-1.5 block">
          {product.brand}
        </span>
        <Link href={`/product/${product.slug || product.id}`} className="text-[15px] font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors leading-snug mb-1">
          {product.name}
        </Link>
        <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
          {product.gender && (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider">{product.gender}</span>
          )}
          {product.type && (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider">{product.type}</span>
          )}
          {product.style && (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider">{product.style}</span>
          )}
        </div>
      </div>
      
      {/* Price & Action */}
      <div className="pt-4 mt-auto flex justify-between items-end border-t border-gray-100 gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-gray-400 mb-0.5 font-medium">Price</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[18px] font-bold tracking-tight ${discountBadge ? 'text-red-600' : 'text-zinc-900'}`}>{product.price}</span>
            {product.compareAtPriceStr && (
              <span className="text-[13px] text-gray-400 line-through font-medium whitespace-nowrap">{product.compareAtPriceStr}</span>
            )}
          </div>
        </div>
        <Link 
          href={`/product/${product.slug || product.id}`} 
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-zinc-900 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105 active:scale-95 shrink-0 shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
