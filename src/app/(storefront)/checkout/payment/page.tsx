import React from 'react';


import CheckoutPayment from "@/app/(storefront)/checkout/_components/CheckoutPayment";
import OrderSummary from "@/app/(storefront)/checkout/_components/OrderSummary";

export default function PaymentMethodPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      
      
      <main className="flex-1 bg-white">
        <div className="max-w-[1280px] mx-auto px-[64px] py-[64px]">
          
          <div className="flex flex-col lg:flex-row gap-[64px]">
            
            {/* Left Column: Payment Method */}
            <div className="flex-[2] min-w-0">
              <CheckoutPayment />
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
