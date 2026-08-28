"use client";

import React, { useState } from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

export default function CheckoutPayment() {
  const [activeMethod, setActiveMethod] = useState<string>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems, shippingAddress, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handlePayNow = async () => {
    if (!shippingAddress) {
      alert("Please provide a shipping address first.");
      router.push('/checkout/shipping');
      return;
    }
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          shippingAddress,
          customerEmail: session?.user?.email || 'guest@example.com'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process order');
      }
      
      clearCart();
      router.push('/checkout/success');
    } catch (err: any) {
      alert(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-[32px] w-full">
      <div className="flex flex-col gap-[12px]">
        <h1 className="font-['Liberation_Serif'] text-[36px] text-black leading-[40px]">
          Payment Method
        </h1>
        <div className="bg-black h-[2px] w-[40px]"></div>
        <p className="font-['Hanken_Grotesk'] text-[#44474c] text-[14px] mt-1">
          All transactions are secure and encrypted.
        </p>
      </div>

      <div className="bg-white border border-[#c4c6cc] rounded-[20px] overflow-hidden flex flex-col w-full">
        
        {/* Method 1: Credit / Debit Card */}
        <div className="border-b border-[#c4c6cc]">
          <div 
            onClick={() => setActiveMethod('credit_card')}
            className="flex items-center gap-[16px] px-[24px] py-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${activeMethod === 'credit_card' ? 'border-[#004d34]' : 'border-[#c4c6cc]'}`}>
              {activeMethod === 'credit_card' && <div className="w-[10px] h-[10px] bg-[#004d34] rounded-full"></div>}
            </div>
            <span className="font-['Hanken_Grotesk'] font-medium text-[16px] text-black flex-1">Credit / Debit Card</span>
            <div className="flex gap-2">
              {/* Payment Icons */}
              <div className="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-600">VISA</div>
              <div className="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-600">MC</div>
              <div className="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-600">AMEX</div>
            </div>
          </div>
          
          {activeMethod === 'credit_card' && (
            <div className="px-[24px] pb-[24px] pt-[8px] bg-gray-50/50">
              <div className="flex flex-col gap-[16px]">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Card Number" 
                    className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-[#004d34]"
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-[16px]">
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-[#004d34]"
                  />
                  <input 
                    type="text" 
                    placeholder="Security Code (CVV)" 
                    className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-[#004d34]"
                  />
                </div>
                
                <input 
                  type="text" 
                  placeholder="Name on Card" 
                  className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-[#004d34]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Method 2: PayPal */}
        <div className="border-b border-[#c4c6cc]">
          <div 
            onClick={() => setActiveMethod('paypal')}
            className="flex items-center gap-[16px] px-[24px] py-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${activeMethod === 'paypal' ? 'border-[#004d34]' : 'border-[#c4c6cc]'}`}>
              {activeMethod === 'paypal' && <div className="w-[10px] h-[10px] bg-[#004d34] rounded-full"></div>}
            </div>
            <span className="font-['Hanken_Grotesk'] font-medium text-[16px] text-black">PayPal</span>
          </div>
          {activeMethod === 'paypal' && (
            <div className="px-[24px] pb-[24px] pt-[8px] bg-gray-50/50 flex flex-col items-center justify-center py-8">
               <p className="font-['Hanken_Grotesk'] text-[#44474c] text-[15px] text-center max-w-sm mb-6">
                 After clicking "Pay Now", you will be redirected to PayPal to complete your purchase securely.
               </p>
            </div>
          )}
        </div>

        {/* Method 3: Apple Pay */}
        <div className="border-b border-[#c4c6cc]">
          <div 
            onClick={() => setActiveMethod('apple_pay')}
            className="flex items-center gap-[16px] px-[24px] py-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${activeMethod === 'apple_pay' ? 'border-[#004d34]' : 'border-[#c4c6cc]'}`}>
              {activeMethod === 'apple_pay' && <div className="w-[10px] h-[10px] bg-[#004d34] rounded-full"></div>}
            </div>
            <span className="font-['Hanken_Grotesk'] font-medium text-[16px] text-black">Apple Pay</span>
          </div>
        </div>

        {/* Method 4: Google Pay */}
        <div>
          <div 
            onClick={() => setActiveMethod('google_pay')}
            className="flex items-center gap-[16px] px-[24px] py-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${activeMethod === 'google_pay' ? 'border-[#004d34]' : 'border-[#c4c6cc]'}`}>
              {activeMethod === 'google_pay' && <div className="w-[10px] h-[10px] bg-[#004d34] rounded-full"></div>}
            </div>
            <span className="font-['Hanken_Grotesk'] font-medium text-[16px] text-black">Google Pay</span>
          </div>
        </div>
      </div>

      {/* Pay Now Button */}
      <button 
        onClick={handlePayNow}
        disabled={isProcessing}
        className="mt-[16px] bg-[#004d34] text-white font-['Hanken_Grotesk'] font-medium text-[16px] py-[16px] px-[32px] rounded-full w-full hover:bg-[#003825] transition-colors disabled:opacity-75 flex justify-center items-center h-[56px]"
      >
        {isProcessing ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          "Pay Now"
        )}
      </button>

    </div>
  );
}
