"use client";

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function WishlistButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [added, setAdded] = useState(false);

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please login to add to wishlist!");
      return;
    }
    
    try {
      const res = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setAdded(true);
        toast.success("Added to wishlist!");
      } else {
        toast.error("Could not update wishlist.");
      }
    } catch (e) {
      toast.error("Error adding to wishlist");
    }
  };

  return (
    <button 
      onClick={handleAddToWishlist}
      className={`absolute top-4 right-4 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-sm z-10 border border-gray-200 ${added ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:scale-110 hover:bg-white'}`}
      title="Add to Wishlist"
    >
      <Heart className={`w-5 h-5 ${added ? 'fill-current' : ''}`} />
    </button>
  );
}
