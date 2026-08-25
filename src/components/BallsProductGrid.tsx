"use client";

import React from 'react';
import QuickAddOverlay from './QuickAddOverlay';
import WishlistButton from './WishlistButton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ProductType } from '@/data/products';
import { useState, useEffect } from 'react';

export default function BallsProductGrid() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', 'balls');
      
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
    <div className="flex-1">
      <div className="flex justify-between items-center mb-8 border-b border-[#bec9c1] pb-4">
        <p className="text-zinc-700 text-base">Showing {products.length} premium results</p>
        <select className="bg-transparent text-sm font-semibold text-zinc-900 uppercase tracking-widest focus:outline-none cursor-pointer">
          <option>Sort: Recommended</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-[#ddd9ce] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full">
            <div className="w-full h-64 bg-zinc-50 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
              <img src={`/images/${product.image}`} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-medium -z-10 text-sm">
                Needs {product.image}
              </div>
            </div>
            
            <div className="flex flex-col flex-grow">
              <span className="text-[14px] font-semibold text-zinc-600 uppercase tracking-widest mb-1">{product.brand}</span>
              <Link href={`/product/${product.id}`} className="text-2xl font-semibold text-zinc-900 group-hover:text-green-700 transition-colors leading-tight mb-2 font-serif">
                {product.name}
              </Link>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#ddd9ce] flex justify-between items-center">
              <span className="text-3xl font-medium text-[#003319] font-serif">{product.price}</span>
              <button className="w-12 h-12 rounded-full border border-[#ddd9ce] flex items-center justify-center hover:bg-[#003319] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

