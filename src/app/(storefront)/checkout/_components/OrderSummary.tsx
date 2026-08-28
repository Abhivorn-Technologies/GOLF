"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
}

export default function OrderSummary({ showCheckoutButton = false }: OrderSummaryProps) {
  const { cartItems, updateCartItemVariants } = useCart();

  const getVariants = (val?: string) => val ? val.split(',').map(s => {
    const trimmed = s.trim();
    if (trimmed.includes(':')) {
      const [name, stockStr] = trimmed.split(':');
      const stock = parseInt(stockStr.trim());
      return { name: name.trim(), stock: isNaN(stock) ? null : stock };
    }
    return { name: trimmed, stock: null };
  }).filter(v => Boolean(v.name)) : [];

  let canCheckout = true;

  // Helper to parse price string (e.g. "₹19,990.00" -> 19990.00)
  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.-]+/g,""));
  };

  const subtotal = cartItems.reduce((total, item) => {
    return total + (parsePrice(item.product.price) * item.quantity);
  }, 0);

  const shipping = subtotal > 0 ? 500 : 0; // Flat ₹500 shipping if cart not empty
  const taxes = subtotal * 0.18; // 18% tax assumption
  const total = subtotal + shipping + taxes;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-[#f8f9fa] border border-[#c4c6cc] rounded-[20px] p-[32px] w-full flex flex-col h-full min-h-[500px]">
      
      <div className="border-b border-[#c4c6cc] pb-[24px] mb-[24px]">
        <h2 className="font-['Liberation_Serif'] font-bold text-[24px] text-black">
          Order Summary
        </h2>
      </div>

      {/* Line Items */}
      <div className="flex flex-col gap-[24px] flex-grow overflow-y-auto mb-[32px]">
        {cartItems.length === 0 ? (
          <p className="text-[#44474c] font-['Hanken_Grotesk'] text-[15px] italic">
            Your cart is empty.
          </p>
        ) : (
          cartItems.map((item, index) => {
            const product = item.product;
            const sizes = getVariants(product.size);
            const lofts = getVariants(product.loft);
            const styles = getVariants(product.style);
            const dynamicVariants = (product as any).attributes?.map((attr: any) => ({
              key: attr.key,
              values: getVariants(attr.value)
            }))?.filter((attr: any) => attr.values.length > 0) || [];

            const requiredVariants: { key: string, options: { name: string, stock: number | null }[] }[] = [];
            if (sizes.length > 1) requiredVariants.push({ key: 'Size', options: sizes });
            if (lofts.length > 1) requiredVariants.push({ key: 'Loft', options: lofts });
            if (styles.length > 1) requiredVariants.push({ key: 'Style', options: styles });
            dynamicVariants.forEach((attr: any) => {
              if (attr.values.length > 1) requiredVariants.push({ key: attr.key, options: attr.values });
            });

            const missingVariants = requiredVariants.filter(rv => !item.variants?.[rv.key]);
            if (missingVariants.length > 0) {
              canCheckout = false;
            }

            return (
              <div key={item.cartItemId} className="flex gap-[16px] items-start">
                <Link href={`/product/${item.product.slug || item.product.id}`} className="w-[80px] h-[80px] bg-white border border-[#c4c6cc] rounded-[8px] flex items-center justify-center p-[8px] hover:border-black transition-colors shrink-0">
                  <img 
                    src={item.product.image.startsWith('http') ? item.product.image : `/images/${item.product.image}`} 
                    alt={item.product.name} 
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </Link>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <Link href={`/product/${item.product.slug || item.product.id}`} className="font-['Hanken_Grotesk'] font-bold text-[16px] text-black hover:underline hover:text-green-800 transition-colors truncate">
                      {item.product.name}
                    </Link>
                    <div className="font-['Hanken_Grotesk'] font-bold text-[16px] text-black shrink-0">
                      {formatPrice(parsePrice(item.product.price) * item.quantity)}
                    </div>
                  </div>
                  
                  <span className="font-['Hanken_Grotesk'] text-[#717b71] text-[14px] mt-1">
                    Qty: {item.quantity}
                  </span>

                  {/* Render Selected Variants */}
                  {item.variants && Object.keys(item.variants).length > 0 && (
                    <div className="font-['Hanken_Grotesk'] text-[13px] text-gray-500 mt-1 flex flex-wrap gap-x-3">
                      {Object.entries(item.variants).map(([k, v]) => (
                        <span key={k}>{k}: <span className="font-medium text-gray-700">{v}</span></span>
                      ))}
                    </div>
                  )}

                  {/* Render Selects for Missing Variants */}
                  {missingVariants.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {missingVariants.map(rv => (
                        <div key={rv.key} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-red-600 uppercase">Select {rv.key}:</span>
                          <select 
                            className="text-sm border border-red-200 rounded px-2 py-1 outline-none focus:border-red-400 bg-red-50/50"
                            value=""
                            onChange={(e) => {
                              updateCartItemVariants(item.cartItemId, { ...item.variants, [rv.key]: e.target.value });
                            }}
                          >
                            <option value="" disabled>Choose...</option>
                            {rv.options.map(opt => {
                              const outOfStock = opt.stock === 0;
                              return (
                                <option key={opt.name} value={opt.name} disabled={outOfStock}>
                                  {opt.name} {outOfStock ? '(Out of Stock)' : ''}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-auto">
        {/* Totals */}
        <div className="flex flex-col gap-[12px] font-['Hanken_Grotesk'] text-[15px] text-[#44474c]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-black">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-medium text-black">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span className="font-medium text-black">{formatPrice(taxes)}</span>
          </div>
        </div>

        <div className="h-px bg-[#c4c6cc] w-full my-[24px]"></div>

        <div className="flex justify-between items-center font-['Liberation_Serif'] font-bold text-[24px] text-black">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {showCheckoutButton && cartItems.length > 0 && (
          <div className="mt-[24px]">
            {!canCheckout && (
              <div className="text-sm text-red-600 font-medium mb-3 text-center">
                Please select all required options for your items before checking out.
              </div>
            )}
            {canCheckout ? (
              <Link 
                href="/checkout/shipping"
                className="bg-[#004d34] text-white font-['Hanken_Grotesk'] font-medium text-[16px] py-[16px] px-[32px] rounded-full w-full hover:bg-[#003825] transition-colors flex justify-center items-center"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <button 
                disabled
                className="bg-gray-300 text-gray-500 font-['Hanken_Grotesk'] font-medium text-[16px] py-[16px] px-[32px] rounded-full w-full cursor-not-allowed flex justify-center items-center"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}
