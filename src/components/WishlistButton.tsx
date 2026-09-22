"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

let sharedWishlistPromise: Promise<any[]> | null = null;
let lastFetchTime = 0;

function fetchSharedWishlist(): Promise<any[]> {
  const now = Date.now();
  if (sharedWishlistPromise && (now - lastFetchTime < 10000)) {
    return sharedWishlistPromise;
  }
  lastFetchTime = now;
  sharedWishlistPromise = fetch('/api/user/wishlist')
    .then((res) => (res.ok ? res.json() : { wishlist: [] }))
    .then((data) => data.wishlist || [])
    .catch(() => []);
  return sharedWishlistPromise;
}

export function invalidateWishlistCache() {
  sharedWishlistPromise = null;
  lastFetchTime = 0;
}

export default function WishlistButton({ productId, className }: { productId: string, className?: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session || !productId) return;
    let isMounted = true;
    
    async function checkWishlist() {
      try {
        const wishlistedItems = await fetchSharedWishlist();
        const strTargetId = productId.toString();
        
        const exists = wishlistedItems.some((item: any) => {
          if (!item) return false;
          if (typeof item === 'string') return item === strTargetId;
          const itemId = item._id ? item._id.toString() : (item.id ? item.id.toString() : '');
          return itemId === strTargetId || item.slug === strTargetId;
        });
        
        if (isMounted) setAdded(exists);
      } catch (e) {
        // Silent catch
      }
    }
    
    checkWishlist();
    return () => { isMounted = false; };
  }, [session, productId]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in or register to save items to your wishlist!");
      const returnUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const isNowAdded = data.added !== undefined ? data.added : !added;
        setAdded(isNowAdded);
        invalidateWishlistCache();
        toast.success(isNowAdded ? "Added to wishlist!" : "Removed from wishlist!");
      } else {
        toast.error("Could not update wishlist.");
      }
    } catch (e) {
      toast.error("Error updating wishlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggleWishlist}
      disabled={loading}
      className={className || `absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-sm z-20 border ${
        added 
          ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-md scale-105' 
          : 'text-gray-400 hover:text-rose-500 hover:scale-110 hover:bg-white border-gray-200'
      }`}
      title={added ? "Remove from Wishlist" : "Add to Wishlist"}
      suppressHydrationWarning
    >
      <Heart className={`w-4 h-4 transition-all duration-300 ${
        added 
          ? 'fill-red-600 text-red-600 scale-110' 
          : 'fill-none text-gray-400 hover:text-red-500'
      }`} />
    </button>
  );
}

