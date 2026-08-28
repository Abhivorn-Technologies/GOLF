"use client";

import React from 'react';
import ProductCard from "@/components/ProductCard";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { ProductType } from '@/data/products';
import { useState, useEffect } from 'react';

export default function CategoryProductGrid({ category }: { category: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, totalItems: 0 });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', category);
      
      try {
        const res = await fetch('/api/products/public?' + params.toString());
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
          if (json.pagination) {
            setPagination(json.pagination);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex-1 pb-[120px]">
      
      {/* Product Grid - 2 Column Layout as per Figma */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[24px] gap-y-[32px] mb-[48px] transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />))
        ) : (
          !loading && (
            <div className="col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-serif text-gray-800 mb-2">No {category} found</h3>
              <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-[8px]">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="w-[40px] h-[40px] border border-[#c1c9bf] rounded-[4px] flex items-center justify-center hover:bg-[#f4f6f4] text-[#717b71] disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10L2 6L6 2"/></svg>
          </button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-[40px] h-[40px] rounded-[4px] font-medium text-[14px] flex items-center justify-center ${
                page === pagination.currentPage 
                  ? 'bg-[#006747] text-white' 
                  : 'border border-[#c1c9bf] hover:bg-[#f4f6f4] text-[#414942]'
              }`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="w-[40px] h-[40px] border border-[#c1c9bf] rounded-[4px] flex items-center justify-center hover:bg-[#f4f6f4] text-[#717b71] disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10L6 6L2 2"/></svg>
          </button>
        </div>
      )}

    </div>
  );
}
