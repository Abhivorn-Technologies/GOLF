"use client";

import React from 'react';
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NewArrivalsGrid() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      // Explicitly ask for new arrivals only
      params.set('newArrivals', 'true');
      // Remove category if it exists to show all new arrivals
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
      
      {/* Product Grid - 3 Column Layout for New Arrivals page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[32px] mb-[48px]">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-serif text-gray-800 mb-2">No new arrivals right now</h3>
            <p className="text-gray-500">Check back later for the latest premium gear drops.</p>
          </div>
        )}
      </div>

    </div>
  );
}
