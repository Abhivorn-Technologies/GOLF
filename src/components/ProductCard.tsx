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
    <div className="bg-white border border-gray-100 rounded-[16px] p-[16px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer flex flex-col h-full relative overflow-hidden">
      <WishlistButton productId={product._id || product.id} />
      
      {/* Sale Badge */}
      {discountBadge && (
        <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm z-10">
          {discountBadge}
        </div>
      )}
      
      {/* Product Image Area */}
      <Link href={`/product/${product.slug || product.id}`} className="w-full aspect-[4/3] bg-gray-50/50 rounded-[12px] mb-[24px] overflow-hidden relative flex items-center justify-center block">
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
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px] mb-[8px] block">
          {product.brand}
        </span>
        <Link href={`/product/${product.slug || product.id}`} className="text-[15px] font-semibold text-zinc-900 group-hover:text-black transition-colors leading-snug mb-[4px]">
          {product.name}
        </Link>
        <div className="flex flex-wrap gap-2 mt-1 mb-[8px]">
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
      <div className="pt-[20px] mt-auto flex justify-between items-end border-t border-gray-50 gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] text-gray-400 mb-1">Price</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[18px] font-bold tracking-tight ${discountBadge ? 'text-red-600' : 'text-zinc-900'}`}>{product.price}</span>
            {product.compareAtPriceStr && (
              <span className="text-[14px] text-gray-400 line-through font-medium whitespace-nowrap">{product.compareAtPriceStr}</span>
            )}
          </div>
        </div>
        <Link 
          href={`/product/${product.slug || product.id}`} 
          className="w-[44px] h-[44px] rounded-full bg-gray-50 flex items-center justify-center text-zinc-900 transition-all duration-300 group-hover:bg-black group-hover:text-white shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
