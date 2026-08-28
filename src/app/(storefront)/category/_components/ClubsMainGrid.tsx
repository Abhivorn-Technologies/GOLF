import React from 'react';
import Link from 'next/link';
import ProductCard from "@/components/ProductCard";

export default function ClubsMainGrid() {
  // Using 6 placeholder items for the 42 premium results grid
  const products = [
    { id: 1, name: 'Premium Wedge 1', brand: 'Titleist', price: '₹14,500' },
    { id: 2, name: 'Premium Driver 2', brand: 'TaylorMade', price: '₹44,500' },
    { id: 3, name: 'Iron Set Pro', brand: 'Callaway', price: '₹85,800' },
    { id: 4, name: 'Putter Elite', brand: 'Scotty Cameron', price: '₹32,900' },
    { id: 5, name: 'Hybrid Utility X', brand: 'Ping', price: '₹22,500' },
    { id: 6, name: 'Fairway Wood Z', brand: 'Cobra', price: '₹25,000' }
  ];

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-8 border-b border-[#bec9c1] pb-4">
        <p className="text-zinc-700 text-base">Showing 42 premium results</p>
        <select className="bg-transparent text-sm font-semibold text-zinc-900 uppercase tracking-widest focus:outline-none cursor-pointer">
          <option>Sort: Recommended</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />))}
      </div>
    </div>
  );
}
