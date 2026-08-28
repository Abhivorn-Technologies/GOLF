"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeartOff, ShoppingCart, Trash2 } from 'lucide-react';
import AccountSidebar from "@/app/(storefront)/account/_components/AccountSidebar";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch('/api/user/wishlist');
        const data = await res.json();
        if (res.ok) {
          setWishlist(data.wishlist);
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
        const data = await res.json();
        // The API returns the array of ObjectIds, but our UI expects populated objects.
        // It's easier to just filter out the removed item locally:
        setWishlist(wishlist.filter(item => item._id !== productId));
      } else {
        alert("Could not update wishlist. Local DB may be blocked.");
      }
    } catch (e) {
      alert("Error updating wishlist");
    }
  };

  return (
    <div className="bg-[#f4f4f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-8"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col md:flex-row gap-12 items-start">
        <AccountSidebar />

        <div className="flex-1 w-full max-w-4xl">
          <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-8">
            My Wishlist
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
              <p className="font-semibold text-sm">Loading wishlist...</p>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-16 text-center flex flex-col items-center">
              <HeartOff className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1.5} />
              <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tighter">Your wishlist is empty</h3>
              <p className="font-medium text-gray-500 text-sm mb-8 max-w-md">
                Looks like you haven't saved any items yet. Find something you love and click the heart icon!
              </p>
              <Link href="/" className="inline-block bg-black text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-md">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <div key={product._id} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
                  
                  <div className="h-48 bg-gray-50 relative p-4 flex items-center justify-center">
                    <img src={product.images?.[0] || "/images/golf.png"} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                    <button 
                      onClick={() => handleRemove(product._id)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      {product.brand || 'Premium'}
                    </span>
                    <h3 className="text-base font-black leading-tight text-black mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="mt-auto">
                      <span className="text-lg font-black text-black mb-4 block">
                        ₹{product.price?.toLocaleString()}
                      </span>
                      <button className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        <ShoppingCart className="w-4 h-4" /> Move to Cart
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
  );
}
