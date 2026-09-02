"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Package, MapPin, CreditCard, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function OrderSuccessPage() {
  const { cartItems } = useCart();
  const [orderNumber, setOrderNumber] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get('orderId');
    
    if (orderId) {
      setOrderNumber(`LOR-${orderId.slice(-8).toUpperCase()}`);
    } else {
      setOrderNumber(`LOR-${Math.floor(1000000 + Math.random() * 9000000)}`);
    }
    
    const date = new Date();
    date.setDate(date.getDate() + 3);
    setDeliveryDate(date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parsePrice = (priceStr: string | number) => {
    if (typeof priceStr === 'number') return priceStr;
    if (typeof priceStr === 'string') {
      const parsed = parseFloat(priceStr.replace(/[^0-9.-]+/g,""));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden flex flex-col items-center justify-center py-20 px-4">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-200 blur-[120px] opacity-40 mix-blend-multiply animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px] opacity-40 mix-blend-multiply pointer-events-none"></div>

      <div className="w-full max-w-3xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Success Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-400 blur-xl opacity-30 rounded-full animate-pulse"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center relative shadow-2xl shadow-green-900/20 transform hover:scale-105 transition-transform duration-300">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4 leading-tight">
            Order Confirmed
          </h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto text-lg leading-relaxed">
            Thank you for shopping with Lorven Golf. We're getting your gear ready for the course!
          </p>
        </div>

        {/* Main Card (Glassmorphism) */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-8 md:p-12 overflow-hidden relative">
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Order Number Box */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-2 transition-all hover:shadow-md">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Package className="w-4 h-4 text-black" /> Order Reference
              </span>
              <span className="text-2xl font-black text-black tracking-tight">{orderNumber}</span>
            </div>

            {/* Est Delivery Box */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-2 transition-all hover:shadow-md">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Truck className="w-4 h-4 text-black" /> Est. Delivery
              </span>
              <span className="text-2xl font-black text-green-700 tracking-tight">{deliveryDate}</span>
            </div>

          </div>

          {/* Items Preview */}
          {cartItems.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm mb-8">
              <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => {
                   const itemPrice = parsePrice(item.product.price);
                   return (
                  <div key={index} className="flex gap-4 items-center p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100">
                      <img 
                        src={item.product.image?.startsWith('http') ? item.product.image : `/images/${item.product.image}`} 
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                      <span className="font-bold text-black uppercase tracking-tight">{item.product.name}</span>
                      <span className="text-gray-500 text-sm font-medium">Qty: {item.quantity}</span>
                      {item.variants && Object.keys(item.variants).length > 0 && (
                        <div className="text-[11px] text-gray-400 font-bold flex gap-2 uppercase tracking-widest mt-1">
                          {Object.entries(item.variants).map(([k,v]) => <span key={k} className="bg-gray-100 px-2 py-0.5 rounded">{k}: {v as string}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="font-black text-black">
                      {formatPrice(itemPrice * item.quantity)}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <Link 
              href="/account/orders"
              className="flex-1 w-full bg-black text-white rounded-2xl py-4 px-8 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all"
            >
              Track Order <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/"
              className="flex-1 w-full bg-white text-black border border-gray-200 rounded-2xl py-4 px-8 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-black transition-all"
            >
              Continue Shopping
            </Link>
          </div>
          
        </div>
      </div>
      
      {/* Custom Scrollbar Styles for the Items Preview */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}} />
    </div>
  );
}
