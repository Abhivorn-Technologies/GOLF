"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck } from 'lucide-react';
import { useCart, ShippingAddress } from '@/context/CartContext';

export default function CheckoutShipping() {
  const router = useRouter();
  const { shippingAddress, setShippingAddress } = useCart();
  const [address, setAddress] = useState<ShippingAddress>(shippingAddress || {
    name: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [activeMethod, setActiveMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setShippingAddress(address);
    setTimeout(() => {
      router.push('/checkout/payment');
    }, 600);
  };

  return (
    <div className="flex flex-col gap-[32px] w-full">
      
      {/* Shipping Address Section */}
      <div className="flex flex-col gap-[12px]">
        <h1 className="font-['Liberation_Serif'] text-[36px] text-black leading-[40px]">
          Shipping Address
        </h1>
        <div className="bg-black h-[2px] w-[40px]"></div>
      </div>

      <form onSubmit={handleContinue} className="flex flex-col gap-[32px]">
        <div className="bg-[#f8f9fa] border border-[#c4c6cc] rounded-[20px] p-[32px] w-full flex flex-col gap-4">
          <input required type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-[#004d34]" />
          <input required type="text" placeholder="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-[#004d34]" />
          <div className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-[#004d34]" />
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-[#004d34]" />
              <input required type="text" placeholder="ZIP" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-[#004d34]" />
            </div>
          </div>
        </div>

      {/* Delivery Method Section */}
      <div className="flex flex-col gap-[12px] mt-[16px]">
        <h1 className="font-['Liberation_Serif'] text-[28px] text-black leading-[32px]">
          Delivery Method
        </h1>
        <div className="bg-black h-[2px] w-[40px]"></div>
      </div>

      <div className="bg-white border border-[#c4c6cc] rounded-[20px] overflow-hidden flex flex-col w-full">
        
        {/* Method 1: Standard */}
        <div className="border-b border-[#c4c6cc]">
          <div 
            onClick={() => setActiveMethod('standard')}
            className="flex items-center gap-[16px] px-[24px] py-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center shrink-0 ${activeMethod === 'standard' ? 'border-[#004d34]' : 'border-[#c4c6cc]'}`}>
              {activeMethod === 'standard' && <div className="w-[10px] h-[10px] bg-[#004d34] rounded-full"></div>}
            </div>
            <div className="flex-1 flex flex-col">
              <span className="font-['Hanken_Grotesk'] font-medium text-[16px] text-black">Standard Shipping</span>
              <span className="font-['Hanken_Grotesk'] text-[14px] text-[#717b71]">Delivery in 3-5 business days</span>
            </div>
            <span className="font-['Hanken_Grotesk'] font-bold text-[16px] text-black">₹500.00</span>
          </div>
        </div>

        {/* Method 2: Express */}
        <div className="border-b border-[#c4c6cc]">
          <div 
            onClick={() => setActiveMethod('express')}
            className="flex items-center gap-[16px] px-[24px] py-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center shrink-0 ${activeMethod === 'express' ? 'border-[#004d34]' : 'border-[#c4c6cc]'}`}>
              {activeMethod === 'express' && <div className="w-[10px] h-[10px] bg-[#004d34] rounded-full"></div>}
            </div>
            <div className="flex-1 flex flex-col">
              <span className="font-['Hanken_Grotesk'] font-medium text-[16px] text-black">Express Shipping</span>
              <span className="font-['Hanken_Grotesk'] text-[14px] text-[#717b71]">Delivery in 1-2 business days</span>
            </div>
            <span className="font-['Hanken_Grotesk'] font-bold text-[16px] text-black">₹1,500.00</span>
          </div>
        </div>

        {/* Method 3: Store Pickup */}
        <div>
          <div 
            onClick={() => setActiveMethod('pickup')}
            className="flex items-center gap-[16px] px-[24px] py-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center shrink-0 ${activeMethod === 'pickup' ? 'border-[#004d34]' : 'border-[#c4c6cc]'}`}>
              {activeMethod === 'pickup' && <div className="w-[10px] h-[10px] bg-[#004d34] rounded-full"></div>}
            </div>
            <div className="flex-1 flex flex-col">
              <span className="font-['Hanken_Grotesk'] font-medium text-[16px] text-black">In-Store Pickup</span>
              <span className="font-['Hanken_Grotesk'] text-[14px] text-[#717b71]">Available within 24 hours at nearest store</span>
            </div>
            <span className="font-['Hanken_Grotesk'] font-bold text-[16px] text-black">Free</span>
          </div>
        </div>
      </div>

        {/* Continue Button */}
        <button 
          type="submit"
          disabled={isProcessing}
          className="mt-[16px] bg-[#004d34] text-white font-['Hanken_Grotesk'] font-medium text-[16px] py-[16px] px-[32px] rounded-full w-full hover:bg-[#003825] transition-colors disabled:opacity-75 flex justify-center items-center h-[56px]"
        >
          {isProcessing ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Continue to Payment"
          )}
        </button>
      </form>

    </div>
  );
}
