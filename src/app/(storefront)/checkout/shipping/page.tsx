import React from 'react';


import CheckoutShipping from "@/app/(storefront)/checkout/_components/CheckoutShipping";
import OrderSummary from "@/app/(storefront)/checkout/_components/OrderSummary";

export default function ShippingPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      
      
      <main className="flex-1 bg-white">
        <div className="max-w-[1280px] mx-auto px-[64px] py-[64px]">
          
          {/* Breadcrumb Steps (Optional) */}
          <div className="flex items-center gap-[8px] text-[14px] font-['Hanken_Grotesk'] mb-[32px]">
            <span className="text-[#006747] font-semibold">Cart</span>
            <span className="text-[#c4c6cc]">{'>'}</span>
            <span className="text-black font-bold">Shipping</span>
            <span className="text-[#c4c6cc]">{'>'}</span>
            <span className="text-[#717b71]">Payment</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-[64px]">
            
            {/* Left Column: Shipping Options */}
            <div className="flex-[2] min-w-0">
              <CheckoutShipping />
            </div>

            {/* Right Column: Order Summary */}
            <div className="flex-[1] min-w-[400px]">
              <OrderSummary />
            </div>

          </div>

        </div>
      </main>

      
    </div>
  );
}
