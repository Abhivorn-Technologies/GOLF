"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeartOff, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import AccountSidebar from "@/app/(storefront)/account/_components/AccountSidebar";
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch('/api/user/wishlist');
        const data = await res.json();
        if (res.ok) {
          setWishlist(data.wishlist || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
        toast.success("Item removed from wishlist");
      } else {
        toast.error("Could not update wishlist");
      }
    } catch (e) {
      toast.error("Error updating wishlist");
    }
  };

  const handleMoveToCart = (product: any) => {
    const formattedProduct = {
      id: product._id || product.id,
      title: product.title,
      price: product.price,
      images: product.images || [],
      category: product.category,
      brand: product.brand,
    };
    addToCart(formattedProduct as any, 1);
    toast.success("Item moved to cart!");
  };

  return (
    <div className="bg-[#fafafa] min-h-screen py-8 md:py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <AccountSidebar />

          <div className="flex-1 w-full">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">My Wishlist</h1>
                  <p className="text-sm text-zinc-500 mt-1">Saved items you love and wish to purchase</p>
                </div>
                {wishlist.length > 0 && (
                  <span className="bg-zinc-100 text-zinc-800 text-xs font-bold px-3 py-1.5 rounded-full">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                  <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mb-4"></div>
                  <p className="font-semibold text-sm">Loading your wishlist...</p>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-5">
                    <HeartOff className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">Your wishlist is empty</h3>
                  <p className="font-medium text-zinc-500 text-sm mb-8 max-w-md">
                    Explore our golf collection and click the heart icon to save products to your account.
                  </p>
                  <Link 
                    href="/products" 
                    className="inline-flex items-center gap-2 bg-zinc-900 text-white px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-md"
                  >
                    <span>Browse Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((product) => {
                    const prodId = product._id || product.id;
                    return (
                      <div key={prodId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md group">
                        
                        <div className="h-52 bg-zinc-50 relative p-4 flex items-center justify-center border-b border-gray-50">
                          <img 
                            src={product.images?.[0] || "/images/golf.png"} 
                            alt={product.title} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
                          />
                          <button 
                            onClick={() => handleRemove(prodId)}
                            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="p-5 flex flex-col flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">
                            {product.brand || 'Golf Equipment'}
                          </span>
                          <Link href={`/product/${prodId}`} className="hover:underline">
                            <h3 className="text-sm font-bold leading-tight text-zinc-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                              {product.title}
                            </h3>
                          </Link>
                          <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-3">
                            <span className="text-lg font-extrabold text-zinc-900">
                              ₹{typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                            </span>
                            <button 
                              onClick={() => handleMoveToCart(product)}
                              className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-sm"
                            >
                              <ShoppingCart className="w-4 h-4" /> 
                              <span>Move to Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

