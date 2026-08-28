import React from 'react';
import QuickAddOverlay from "@/app/(storefront)/product/_components/QuickAddOverlay";
import WishlistButton from "@/components/WishlistButton";
import Link from 'next/link';
import ProductCard from "@/components/ProductCard";

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
          <ProductCard key={product.id} product={product} />))}
      </div>
    </div>
  );
}
