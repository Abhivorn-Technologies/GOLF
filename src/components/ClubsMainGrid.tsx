import React from 'react';
import Link from 'next/link';

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
          <div key={product.id} className="bg-white border border-[#ddd9ce] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full">
            <div className="w-full h-64 bg-zinc-50 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center border border-zinc-100">
              <img src="/images/Background+Border.png" alt="Placeholder" className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" />
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
