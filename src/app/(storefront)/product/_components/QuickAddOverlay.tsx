"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function QuickAddOverlay({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      toast.error("Please sign in or register to add items to your cart!");
      const returnUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Quick Add adds 1 quantity
    addToCart(product, 1, {});
    setAdded(true);
    toast.success('Added to cart!');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent pointer-events-none transition-colors duration-300"></div>
      <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <button 
          suppressHydrationWarning
          onClick={handleQuickAdd}
          className="w-full bg-white hover:bg-zinc-900 hover:text-white text-zinc-900 font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-wide text-xs"
        >
          {added ? <><Check className="w-4 h-4" /> Added</> : <><Plus className="w-4 h-4" /> Quick Add</>}
        </button>
      </div>
    </>
  );
}
