"use client";

import React, { useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ALL_PRODUCTS, ProductType } from '@/data/products';
import { ShoppingCart, Heart, Filter, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

function ProductsContent() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const brandParam = searchParams.get('brand');
  const categoryParam = searchParams.get('category');
  
  const [filter, setFilter] = useState('All');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Fetch user's wishlist
  React.useEffect(() => {
    if (session) {
      fetch('/api/user/wishlist')
        .then(res => res.json())
        .then(data => {
          if (data.wishlist) {
            // map from populated products to product IDs if necessary, or assume it's just IDs
            const ids = data.wishlist.map((item: any) => typeof item === 'string' ? item : item.id || item._id);
            setWishlist(ids);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  // Sync category param with filter state
  React.useEffect(() => {
    if (categoryParam) {
      setFilter(categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase());
    } else {
      setFilter('All');
    }
  }, [categoryParam]);

  const categories = ['All', 'Clubs', 'Shoes', 'Bags', 'Balls', 'Apparel', 'Accessories'];

  const [baseProducts, setBaseProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== 'All') {
          params.set('category', filter.toLowerCase());
        }
        if (brandParam) {
          params.set('brand', brandParam);
        }
        
        const res = await fetch('/api/products/public?' + params.toString());
        const json = await res.json();
        if (json.success) {
          setBaseProducts(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filter, brandParam]);

  // 2. Extract unique dynamic attributes from the CURRENTly displayed products
  // So if you're in 'Clubs', you see 'Loft' filter. If in 'Shoes', you see 'Size'.
  const availableFilters = useMemo(() => {
    const filters: Record<string, Set<string>> = {};
    
    baseProducts.forEach(p => {
      // Add Brand as a dynamic filter
      if (p.brand) {
        if (!filters['Brand']) filters['Brand'] = new Set();
        filters['Brand'].add(p.brand);
      }
      
      // Add Gender as a dynamic filter
      if (p.gender) {
        if (!filters['Gender']) filters['Gender'] = new Set();
        filters['Gender'].add(p.gender);
      }

      // Add dynamic custom attributes (if any exist on the product object)
      const dynamicAttrs = (p as any).attributes || [];
      dynamicAttrs.forEach((attr: { key: string, value: string }) => {
        if (!filters[attr.key]) filters[attr.key] = new Set();
        filters[attr.key].add(attr.value);
      });
    });

    return filters;
  }, [baseProducts]);

  // 3. Apply the checked dynamic filters
  const displayedProducts = useMemo(() => {
    return baseProducts.filter(p => {
      // Check every active filter category
      for (const [key, selectedValues] of Object.entries(selectedAttributes)) {
        if (selectedValues.length === 0) continue; // nothing selected for this filter category
        
        let productValue: string | undefined;
        
        if (key === 'Brand') productValue = p.brand;
        else if (key === 'Gender') productValue = p.gender;
        else {
          const dynamicAttr = (p as any).attributes?.find((a: any) => a.key === key);
          productValue = dynamicAttr?.value;
        }

        // If product doesn't have the attribute, or its value isn't checked, hide it
        if (!productValue || !selectedValues.includes(productValue)) {
          return false;
        }
      }
      return true;
    });
  }, [baseProducts, selectedAttributes]);


  const toggleAttribute = (key: string, value: string) => {
    setSelectedAttributes(prev => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...current, value] };
      }
    });
  };

  const clearFilters = () => setSelectedAttributes({});

  const handleAddToWishlist = async (productId: string) => {
    if (!session) {
      // Optional: Maybe redirect to login or show a subtle toast instead of an alert later.
      return;
    }
    
    // Optimistic UI update
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );

    try {
      await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
    } catch (e) {
      console.error("Error adding to wishlist", e);
      // Revert optimistic update on error if needed
    }
  };

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-12 relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="mb-8 border-b border-gray-200 pb-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-2">
                {brandParam ? `${brandParam} Gear` : (filter === 'All' ? 'Shop All Gear' : `Shop ${filter}`)}
              </h1>
              <p className="text-gray-500 font-medium">Browse our premium collection of golf equipment.</p>
            </div>
          </div>
        </div>
          
        

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6 flex justify-between items-center">
          <p className="text-sm font-bold text-gray-700">{displayedProducts.length} Results</p>
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Dynamic Sidebar */}
          <aside className={`
            fixed inset-0 z-50 bg-white p-6 overflow-y-auto transition-transform transform lg:relative lg:transform-none lg:w-64 lg:bg-transparent lg:p-0 lg:z-0 lg:block flex-shrink-0
            ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex justify-between items-center lg:hidden mb-8 border-b pb-4">
              <h2 className="text-xl font-black uppercase tracking-wider">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 flex justify-between items-center hidden lg:flex">
              <h2 className="text-lg font-black uppercase tracking-wider">Filters</h2>
              {Object.values(selectedAttributes).flat().length > 0 && (
                <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {Object.keys(availableFilters).length === 0 ? (
              <p className="text-sm text-gray-500 italic">No filters available for this category.</p>
            ) : (
              Object.entries(availableFilters).map(([filterKey, filterValues]) => (
                <div key={filterKey} className="mb-6 border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4">{filterKey}</h3>
                  <div className="space-y-3">
                    {Array.from(filterValues).sort().map(val => {
                      const isChecked = selectedAttributes[filterKey]?.includes(val) || false;
                      return (
                        <label key={val} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={isChecked}
                            onChange={() => toggleAttribute(filterKey, val)}
                          />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-black border-black text-white' : 'border-gray-300 bg-white group-hover:border-black'
                          }`}>
                            {isChecked && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className="text-sm text-gray-600 font-medium group-hover:text-black transition-colors">{val}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
            
            {/* Mobile Apply Button */}
            <div className="lg:hidden mt-8">
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 w-full">
            <div className="hidden lg:block mb-6 text-sm font-bold text-gray-500">
              Showing {displayedProducts.length} Results
            </div>

            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-black mb-2">No products match your filters</h3>
                <p className="text-gray-500 mb-6">Try adjusting your dynamic filters or clearing them to see more products.</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-black text-white rounded-full font-bold text-sm uppercase tracking-wider">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {displayedProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
                    
                    {/* Product Image Area */}
                    <Link href={`/product/${product.slug || product.id}`} className="h-60 bg-gray-50 relative p-6 flex items-center justify-center cursor-pointer overflow-hidden">
                      <img 
                        src={product.image?.startsWith('http') || product.image?.startsWith('/') ? product.image : `/images/${product.image}`} 
                        alt={product.name} 
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/golf.png' }}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      {/* Wishlist Button Overlay */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToWishlist(product.id);
                        }}
                        className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors z-10"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${wishlist.includes(product.id) ? 'text-red-500' : ''}`} 
                          strokeWidth={2.5} 
                          fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </Link>
                    
                    {/* Product Details */}
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">
                        {product.brand}
                      </span>
                      <Link href={`/product/${product.slug || product.id}`}>
                        <h3 className="text-base font-black leading-tight text-black mb-1 line-clamp-2 hover:underline">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-xs font-medium mb-4">{product.gender || 'Unisex'} • {product.category}</p>
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-lg font-black text-black">
                          {product.price}
                        </span>
                        <button 
                          onClick={() => {
                            addToCart(product, 1);
                            alert('Added to cart!');
                          }}
                          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
                        >
                          <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
