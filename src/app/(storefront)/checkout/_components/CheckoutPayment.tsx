"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function CheckoutPayment() {
  const [activeMethod, setActiveMethod] = useState<string>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems, shippingAddress, clearCart, couponCode, couponDiscount } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayNow = async () => {
    if (!shippingAddress) {
      toast.error("Please provide a shipping address first.");
      router.push('/checkout/shipping');
      return;
    }
    
    setIsProcessing(true);

    try {
      // 1. Create Order on Server
      const orderResponse = await fetch('/api/orders/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, shippingAddress, discountAmount: couponDiscount || 0 })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // 2. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.amount, 
        currency: orderData.currency,
        name: "Lorven Golf",
        description: "Premium Golf Equipment",
        image: "/images/golf.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify signature and save order on our backend
          try {
            const verifyRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cartItems,
                shippingAddress,
                customerEmail: session?.user?.email || 'guest@example.com',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                couponCode,
                discountAmount: couponDiscount,
              })
            });

            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
              toast.success("Payment successful! Order placed.");
              clearCart();
              router.push('/checkout/success?orderId=' + verifyData.orderId);
            } else {
              toast.error(verifyData.error || "Payment verification failed");
              setIsProcessing(false);
            }
          } catch (err: any) {
            toast.error("Error verifying payment");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: session?.user?.email || 'guest@example.com',
        },
        theme: {
          color: "#000000"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast.error(response.error.description || "Payment failed");
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err: any) {
      toast.error(err.message);
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
          All transactions are secure and encrypted via Razorpay.
        </p>
      </div>

      <div className="bg-white border border-[#c4c6cc] rounded-[20px] overflow-hidden flex flex-col w-full">
        
        {/* Method 1: Razorpay (Cards, UPI, Netbanking) */}
        <div className="border-b border-[#c4c6cc]">
          <div 
            onClick={() => setActiveMethod('razorpay')}
            className="flex items-center gap-[16px] px-[24px] py-[20px] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${activeMethod === 'razorpay' ? 'border-black' : 'border-[#c4c6cc]'}`}>
              {activeMethod === 'razorpay' && <div className="w-[10px] h-[10px] bg-black rounded-full"></div>}
            </div>
            <span className="font-['Hanken_Grotesk'] font-medium text-[16px] text-black flex-1">Cards, UPI, NetBanking</span>
            <div className="flex gap-2">
              <div className="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-600">VISA</div>
              <div className="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-600">UPI</div>
            </div>
          </div>
          
          {activeMethod === 'razorpay' && (
            <div className="px-[24px] pb-[24px] pt-[8px] bg-gray-50/50 flex flex-col items-center justify-center py-8">
               <p className="font-['Hanken_Grotesk'] text-[#44474c] text-[15px] text-center max-w-sm mb-6">
                 After clicking "Pay Now", you will securely complete your purchase via Razorpay.
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Pay Now Button */}
      <button 
        onClick={handlePayNow}
        disabled={isProcessing}
        className="mt-[16px] bg-black text-white font-['Hanken_Grotesk'] font-bold tracking-widest uppercase text-xs py-[16px] px-[32px] rounded-full w-full hover:bg-gray-800 transition-colors disabled:opacity-75 flex justify-center items-center h-[56px]"
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
