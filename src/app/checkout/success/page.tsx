"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';


import { useCart } from '@/context/CartContext';

export default function OrderSuccessPage() {
  const { cartItems } = useCart();
  const [orderNumber, setOrderNumber] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    // Generate a random order number for demo purposes
    setOrderNumber(`GF${Math.floor(100000 + Math.random() * 900000)}`);
    
    // Set delivery date to 3 days from now
    const date = new Date();
    date.setDate(date.getDate() + 3);
    setDeliveryDate(date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
  }, []);

  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.-]+/g,""));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen flex flex-col font-sans">
      
      
      <main className="flex-1 flex flex-col items-center py-[64px] px-[24px]">
        <div className="bg-[#fcf9f8] border border-[#c4c6cc] rounded-[13px] shadow-sm max-w-[800px] w-full p-[48px] relative overflow-hidden">
          
          {/* Subtle background accent */}
          <div className="absolute bg-[#eae7e7] blur-[32px] opacity-20 -right-[64px] -top-[64px] rounded-full w-[256px] h-[256px] pointer-events-none"></div>

          {/* Header Section */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-[80px] h-[80px] bg-[#f0eded] border border-[#c4c6cc] rounded-[12px] flex items-center justify-center mb-[32px]">
              <Check className="w-[32px] h-[32px] text-[#006747]" strokeWidth={3} />
            </div>

            <h1 className="font-['EB_Garamond'] font-extrabold text-[32px] text-black tracking-[0.64px] uppercase mb-[16px]">
              Thank You For Your Order!
            </h1>
            
            <p className="font-['Hanken_Grotesk'] text-[#44474c] text-[16px] leading-[1.6] max-w-[500px]">
              Your payment was successful and your gear is being prepared for shipment. A detailed receipt has been sent to your email.
            </p>
          </div>

          {/* Order Details Box */}
          <div className="mt-[32px] bg-[#fcf9f8] border border-[#c4c6cc] rounded-[9px] p-[24px] flex justify-between items-center relative z-10">
            <div>
              <p className="font-['Hanken_Grotesk'] font-bold text-[#44474c] text-[12px] tracking-[0.6px] uppercase mb-[4px]">
                Order Number
              </p>
              <p className="font-['Hanken_Grotesk'] font-bold text-black text-[18px]">
                #{orderNumber}
              </p>
            </div>
            <div className="text-right sm:text-left">
              <p className="font-['Hanken_Grotesk'] font-bold text-[#44474c] text-[12px] tracking-[0.6px] uppercase mb-[4px]">
                Estimated Delivery
              </p>
              <div className="flex items-center gap-[8px]">
                <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 6L1 11" stroke="#004D34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 6L17 6" stroke="#004D34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="font-['Hanken_Grotesk'] font-bold text-black text-[18px]">
                  {deliveryDate}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary (Bento Style) */}
          {cartItems.length > 0 && (
            <div className="mt-[32px] relative z-10">
              <h2 className="font-['EB_Garamond'] font-bold text-black text-[24px] tracking-[0.24px] border-b border-[#c4c6cc] pb-[8px] mb-[24px]">
                Order Summary
              </h2>
              
              <div className="flex flex-col gap-[16px]">
                {cartItems.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="bg-[#fcf9f8] border border-[#c4c6cc] rounded-[10px] p-[16px] flex items-center gap-[16px]">
                    
                    {/* Product Image */}
                    <Link href={`/product/${item.product.id}`} className="w-[64px] h-[64px] bg-[#eae7e7] border border-[#c4c6cc] rounded-[4px] flex items-center justify-center p-[4px] flex-shrink-0 hover:border-black transition-colors">
                      <img 
                        src={item.product.image.startsWith('http') ? item.product.image : `/images/${item.product.image}`} 
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-center">
                      <Link href={`/product/${item.product.id}`} className="font-['Hanken_Grotesk'] font-semibold text-black text-[13px] uppercase hover:underline hover:text-green-800">
                        {item.product.brand} {item.product.name}
                      </Link>
                      <p className="font-['Hanken_Grotesk'] text-[#44474c] text-[14px] mt-[4px]">
                        Qty: {item.quantity} | {item.product.category === 'shoes' || item.product.category === 'apparel' ? `Size: ${item.product.size || 'M'}` : 'Standard'}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0">
                      <p className="font-['Hanken_Grotesk'] font-bold text-black text-[18px]">
                        {formatPrice(parsePrice(item.product.price) * item.quantity)}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-[32px] pt-[32px] border-t border-[#c4c6cc] flex flex-col sm:flex-row justify-center items-center gap-[16px] relative z-10">
            <Link 
              href="/"
              className="bg-[#004d34] hover:bg-[#003825] transition-colors text-white font-['Hanken_Grotesk'] font-bold text-[12px] uppercase tracking-[0.6px] px-[32px] py-[12px] rounded-[8px] w-full sm:w-auto text-center"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/account/orders"
              className="bg-transparent border border-black hover:bg-black hover:text-white transition-colors text-black font-['Hanken_Grotesk'] font-bold text-[12px] uppercase tracking-[0.6px] px-[32px] py-[12px] rounded-[8px] w-full sm:w-auto text-center"
            >
              View Order Details
            </Link>
          </div>

        </div>
      </main>

      
    </div>
  );
}
