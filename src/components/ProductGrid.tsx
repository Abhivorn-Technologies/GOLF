import React from 'react';
import QuickAddOverlay from './QuickAddOverlay';
import WishlistButton from './WishlistButton';
import Link from 'next/link';

const products = [
  { id: 1, name: 'SM 11 Wedge', brand: 'Titleist', price: '₹14,500', image: 'image 44.png' },
  { id: 2, name: 'Quantum Family', brand: 'Cobra', price: '₹44,500', image: 'image 68.png' },
  { id: 3, name: 'Beres 10 Family', brand: 'Honma', price: '₹85,800', image: 'image 48.png' },
  { id: 4, name: 'Qi10 Family', brand: 'TaylorMade', price: '₹62,900', image: 'image 69.png' },
  { id: 5, name: 'Spider Putters', brand: 'TaylorMade', price: '₹32,500', image: 'image 47.png' },
  { id: 6, name: 'Paradym Ai Smoke', brand: 'Callaway', price: '₹55,000', image: 'image 70.png' }
];

export default function ProductGrid() {
  return (
    <div className="w-full">
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x no-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer min-w-[280px] snap-start">
            <div className="w-full h-80 bg-zinc-100 rounded-2xl mb-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
              <img src={`/images/${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="px-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">{product.brand}</span>
              <Link href={`/product/${product.id}`} className="text-lg font-bold text-zinc-900 group-hover:text-green-600 transition-colors leading-tight mb-2 block">
                {product.name}
              </Link>
              <span className="text-sm font-bold text-zinc-700">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
