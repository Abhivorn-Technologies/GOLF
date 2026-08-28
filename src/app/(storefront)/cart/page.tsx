"use client";

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';


import OrderSummary from "@/app/(storefront)/checkout/_components/OrderSummary";
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

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
    <div className="bg-white min-h-screen flex flex-col font-sans">
      
      
      <main className="flex-1 bg-white">
        <div className="max-w-[1280px] mx-auto px-[64px] py-[64px]">
          
          <div className="flex flex-col gap-[12px] mb-[32px]">
            <h1 className="font-['Liberation_Serif'] text-[36px] text-black leading-[40px]">
              Your Cart
            </h1>
            <div className="bg-black h-[2px] w-[40px]"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-[64px]">
            
            {/* Left Column: Cart Items */}
            <div className="flex-[2] min-w-0">
              {cartItems.length === 0 ? (
                <div className="bg-[#f8f9fa] border border-[#c4c6cc] rounded-[20px] p-[64px] flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <p className="font-['Hanken_Grotesk'] text-[#44474c] text-[18px] mb-[24px]">
                    Your shopping cart is currently empty.
                  </p>
                  <Link 
                    href="/category/shoes"
                    className="bg-[#004d34] text-white font-['Hanken_Grotesk'] font-medium text-[16px] py-[12px] px-[32px] rounded-full hover:bg-[#003825] transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="bg-white border border-[#c4c6cc] rounded-[20px] overflow-hidden flex flex-col">
                  
                  {/* Header */}
                  <div className="flex items-center px-[32px] py-[16px] bg-[#f8f9fa] border-b border-[#c4c6cc] font-['Hanken_Grotesk'] font-bold text-[14px] text-[#44474c] uppercase tracking-wider">
                    <div className="flex-[2]">Product</div>
                    <div className="flex-[1] text-center">Quantity</div>
                    <div className="flex-[1] text-right">Total</div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col divide-y divide-[#c4c6cc]">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center px-[32px] py-[24px]">
                        
                        {/* Product Info */}
                        <div className="flex-[2] flex gap-[24px] items-center">
                          <div className="w-[120px] h-[120px] bg-[#f8f9fa] border border-[#c4c6cc] rounded-[8px] flex items-center justify-center p-[8px]">
                            <img 
                              src={`/images/${item.product.image}`} 
                              alt={item.product.name} 
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div className="flex flex-col gap-[4px]">
                            <span className="font-['Hanken_Grotesk'] text-[12px] font-bold text-[#717b71] uppercase tracking-widest">
                              {item.product.brand}
                            </span>
                            <Link href={`/product/${item.product.slug || item.product.id}`} className="font-['Hanken_Grotesk'] font-bold text-[18px] text-black hover:text-[#006747] transition-colors">
                              {item.product.name}
                            </Link>
                            <span className="font-['Hanken_Grotesk'] text-[15px] text-[#44474c] mt-[4px]">
                              {formatPrice(parsePrice(item.product.price))}
                            </span>
                            
                            {/* Remove button (mobile) */}
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="md:hidden mt-2 text-red-500 hover:text-red-700 font-['Hanken_Grotesk'] text-[14px] flex items-center gap-1 w-fit"
                            >
                              <Trash2 className="w-4 h-4" /> Remove
                            </button>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex-[1] flex justify-center">
                          <div className="flex items-center border border-[#c4c6cc] rounded-full h-[40px] overflow-hidden w-[100px]">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-[32px] h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-black"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="flex-1 h-full flex items-center justify-center font-['Hanken_Grotesk'] font-medium text-[16px] text-black border-x border-[#c4c6cc]">
                              {item.quantity}
                            </div>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-[32px] h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-black"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Total & Remove */}
                        <div className="flex-[1] flex items-center justify-end gap-[16px]">
                          <span className="font-['Hanken_Grotesk'] font-bold text-[18px] text-black">
                            {formatPrice(parsePrice(item.product.price) * item.quantity)}
                          </span>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="hidden md:flex text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="flex-[1] min-w-[400px]">
              <OrderSummary showCheckoutButton={true} />
            </div>

          </div>

        </div>
      </main>

      
    </div>
  );
}
