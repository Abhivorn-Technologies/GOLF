"use client";

import React from 'react';
import QuickAddOverlay from './QuickAddOverlay';
import WishlistButton from './WishlistButton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SaleProductGrid() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      // Explicitly ask for sale items only
      params.set('sale', 'true');
      // Remove category if it exists to show all sale items
      params.delete('category');
      
      try {
        const res = await fetch('/api/products/public?' + params.toString(), { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  return (
    <div className="flex-1 pb-[120px]">
      
      {/* Product Grid - 3 Column Layout for Sale page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[32px] mb-[48px]">
        {products.length > 0 ? (
          products.map((product) => {
            let discountBadge = 'SALE';
            if (product.numericCompareAtPrice && product.numericCompareAtPrice > product.numericPrice) {
              const discountPercent = Math.round(((product.numericCompareAtPrice - product.numericPrice) / product.numericCompareAtPrice) * 100);
              discountBadge = `${discountPercent}% OFF`;
            }

            return (
              <div key={product.id} className="bg-white border border-[#c1c9bf] rounded-[16px] p-[24px] hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full relative">
                
                {/* Sale Badge */}
                <div className="absolute top-6 left-6 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm z-10">
                  {discountBadge}
                </div>

                {/* Product Image Area */}
                <Link href={`/product/${product.id}`} className="w-full aspect-[4/3] bg-[#fbf9f9] rounded-[8px] mb-[24px] overflow-hidden relative flex items-center justify-center block">
                  <div className="w-full h-full bg-zinc-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative">
                    {product.image && product.image !== 'placeholder.png' ? (
                      <img src={product.image} alt={product.name} className="object-contain p-4 w-full h-full" />
                    ) : (
                      <span className="text-[#717b71] font-serif italic text-center px-4">{product.name} Image</span>
                    )}
                  </div>
              </Link>
              
              {/* Product Details */}
                <div className="flex flex-col flex-grow">
                  <Link href={`/product/${product.id}`} className="text-[20px] font-serif font-semibold text-[#1b1c1c] group-hover:text-green-700 transition-colors leading-tight mb-[8px]">
                    {product.name}
                  </Link>
                  <span className="text-[12px] font-medium text-[#717b71] uppercase tracking-[1.2px] mb-[16px] block">{product.brand}</span>
                </div>
                
                {/* Price & Action */}
                <div className="pt-[16px] border-t border-[#c1c9bf] flex justify-between items-center mt-auto">
                  <div>
                    <span className="text-[24px] font-semibold text-red-600 mr-2">{product.price}</span>
                    {product.compareAtPriceStr && (
                      <span className="text-[14px] text-gray-400 line-through font-medium">{product.compareAtPriceStr}</span>
                    )}
                  </div>
                  <button className="w-[48px] h-[48px] rounded-full border border-[#c1c9bf] flex items-center justify-center hover:bg-[#003319] hover:border-[#003319] hover:text-white text-[#1b1c1c] transition-colors group-hover:bg-[#003319] group-hover:text-white flex-shrink-0 ml-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-serif text-gray-800 mb-2">No active sales</h3>
            <p className="text-gray-500">Check back later for discounts and top deals.</p>
          </div>
        )}
      </div>

    </div>
  );
}
