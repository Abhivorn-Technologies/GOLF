"use client";

import React from 'react';
import QuickAddOverlay from './QuickAddOverlay';
import WishlistButton from './WishlistButton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ProductType } from '@/data/products';
import { useState, useEffect } from 'react';

export default function ApparelProductGrid() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', 'apparel');
      
      try {
        const res = await fetch('/api/products/public?' + params.toString());
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[32px] gap-y-[32px] mb-[48px]">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white border border-[#c1c9bf] rounded-[16px] p-[24px] hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full">
              {/* Product Image Area */}
              <Link href={`/product/${product.id}`} className="w-full aspect-[4/3] bg-[#fbf9f9] rounded-[8px] mb-[24px] overflow-hidden relative flex items-center justify-center block">
                <div className="w-full h-full bg-zinc-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  {product.image && product.image !== 'placeholder.png' ? (
                  <img src={product.image.startsWith('http') ? product.image : `/images/${product.image}`} alt={product.name} className="w-full h-full object-contain p-4 mix-blend-multiply" />
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
                <span className="text-[24px] font-semibold text-[#1b1c1c]">{product.price}</span>
                <Link href={`/product/${product.id}`} className="w-[48px] h-[48px] rounded-full border border-[#c1c9bf] flex items-center justify-center hover:bg-[#003319] hover:border-[#003319] hover:text-white text-[#1b1c1c] transition-colors group-hover:bg-[#003319] group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-serif text-gray-800 mb-2">No apparel found</h3>
            <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>

      {/* Pagination - Figma Match */}
      {products.length > 0 && (
        <div className="flex items-center justify-center gap-[8px]">
          <button className="w-[40px] h-[40px] border border-[#c1c9bf] rounded-[4px] flex items-center justify-center hover:bg-[#f4f6f4] text-[#717b71]">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10L2 6L6 2"/></svg>
          </button>
          <button className="w-[40px] h-[40px] bg-[#006747] text-white rounded-[4px] font-medium text-[14px] flex items-center justify-center">1</button>
          <button className="w-[40px] h-[40px] border border-[#c1c9bf] rounded-[4px] hover:bg-[#f4f6f4] text-[#414942] font-medium text-[14px] flex items-center justify-center">2</button>
          <button className="w-[40px] h-[40px] border border-[#c1c9bf] rounded-[4px] hover:bg-[#f4f6f4] text-[#414942] font-medium text-[14px] flex items-center justify-center">3</button>
          <button className="w-[40px] h-[40px] border border-[#c1c9bf] rounded-[4px] flex items-center justify-center hover:bg-[#f4f6f4] text-[#717b71]">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10L6 6L2 2"/></svg>
          </button>
        </div>
      )}

    </div>
  );
}
