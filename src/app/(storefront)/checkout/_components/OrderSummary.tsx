"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { Tag, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
}

export default function OrderSummary({ showCheckoutButton = false }: OrderSummaryProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { 
    cartItems, 
    updateCartItemVariants, 
    subtotal, 
    mrpSubtotal, 
    productDiscountSavings, 
    totalSavings, 
    shipping, 
    taxes, 
    total, 
    couponCode: contextCouponCode, 
    couponDiscount: contextCouponDiscount, 
    setCoupon 
  } = useCart();

  const [couponCode, setCouponCode] = React.useState(contextCouponCode || '');
  const [couponLabel, setCouponLabel] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [applyingCoupon, setApplyingCoupon] = React.useState(false);
  const [availableCoupons, setAvailableCoupons] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/coupons/active')
      .then(res => res.json())
      .then(data => {
        if (data.coupons) setAvailableCoupons(data.coupons);
      })
      .catch(() => {});
  }, []);

  const removeCoupon = () => {
    setCouponCode('');
    setCouponLabel('');
    setCouponError('');
    setCoupon(null, 0);
  };

  const handleApplyCouponClick = async (codeToApply = couponCode) => {
    if (!codeToApply.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToApply.trim(), subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponCode(codeToApply.trim().toUpperCase());
        setCouponLabel(data.description);
        setCoupon(codeToApply.trim().toUpperCase(), data.discount);
      } else {
        setCouponError(data.error || 'Invalid coupon');
        setCoupon(null, 0);
      }
    } catch { setCouponError('Failed to apply coupon'); }
    finally { setApplyingCoupon(false); }
  };

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

  const parsePrice = (priceStr: string | number) => {
    if (typeof priceStr === 'number') return priceStr;
    if (typeof priceStr === 'string') {
      const parsed = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-[#f8f9fa] border border-[#c4c6cc] rounded-[20px] p-[32px] w-full flex flex-col">
      
      <div className="border-b border-[#c4c6cc] pb-[24px] mb-[24px] flex justify-between items-center">
        <h2 className="font-['Liberation_Serif'] font-bold text-[24px] text-black">
          Order Summary
        </h2>
        {!showCheckoutButton && (
          <Link href="/cart" className="text-sm font-bold text-gray-500 hover:text-black underline underline-offset-4 transition-colors">
            Edit Cart
          </Link>
        )}
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
            const salePrice = parsePrice(product.price);
            const rawMrp = (product as any).numericCompareAtPrice || (product as any).compareAtPrice;
            const mrpPrice = parsePrice(rawMrp);
            const hasDiscount = mrpPrice > salePrice;
            const discountPct = hasDiscount ? Math.round(((mrpPrice - salePrice) / mrpPrice) * 100) : 0;

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
              <div key={`${item.cartItemId || item.product?.id || 'item'}-${index}`} className="flex gap-[16px] items-start">
                <Link href={`/product/${item.product.slug || item.product.id}`} className="w-[80px] h-[80px] bg-white border border-[#c4c6cc] rounded-[8px] flex items-center justify-center p-[8px] hover:border-black transition-colors shrink-0">
                  {(() => {
                    const rawImg = item.product?.image || (Array.isArray(item.product?.images) ? item.product.images[0] : null) || '';
                    const imgSrc = !rawImg ? '/images/golf.png' : (rawImg.startsWith('http') || rawImg.startsWith('data:') || rawImg.startsWith('/') ? rawImg : `/images/${rawImg}`);
                    return (
                      <img 
                        src={imgSrc} 
                        alt={item.product?.name || 'Product'} 
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/golf.png'; }}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    );
                  })()}
                </Link>
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <Link href={`/product/${item.product.slug || item.product.id}`} className="font-['Hanken_Grotesk'] font-bold text-[16px] text-black hover:underline hover:text-green-800 transition-colors truncate">
                      {item.product.name}
                    </Link>
                    
                    <div className="flex flex-col items-end shrink-0">
                      <div className="font-['Hanken_Grotesk'] font-bold text-[16px] text-black">
                        {formatPrice(salePrice * item.quantity)}
                      </div>
                      {hasDiscount && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="line-through text-xs text-gray-400 font-medium">
                            {formatPrice(mrpPrice * item.quantity)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-1 py-0.2 rounded">
                            {discountPct}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <span className="font-['Hanken_Grotesk'] text-[#717b71] text-[14px] mt-1">
                    Qty: {item.quantity}
                  </span>

                  {/* Render Selected Variants */}
                  {item.variants && Object.keys(item.variants).length > 0 && (
                    <div className="font-['Hanken_Grotesk'] text-[13px] text-gray-500 mt-1 flex flex-wrap gap-x-3">
                      {Object.entries(item.variants)
                        .filter(([k]) => k !== 'variantId')
                        .map(([k, v]) => (
                        <span key={k}>{k}: <span className="font-medium text-gray-700">{v as string}</span></span>
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
        {/* Coupon Code */}
        <div className="flex flex-col gap-2 mb-6">
          {contextCouponDiscount > 0 ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" /> Coupon ({contextCouponCode}) Applied 🎉
                </span>
                <p className="text-xs text-emerald-700 mt-0.5">{couponLabel || `Extra Coupon Discount: -${formatPrice(contextCouponDiscount)}`}</p>
              </div>
              <button onClick={removeCoupon} className="text-xs text-red-600 hover:text-red-800 font-bold">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                placeholder="Promo code"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCouponClick()}
                className="flex-1 border border-[#c4c6cc] rounded-xl px-4 py-2.5 text-sm font-['Hanken_Grotesk'] outline-none focus:border-black transition-colors uppercase"
              />
              <button
                onClick={() => handleApplyCouponClick()}
                disabled={applyingCoupon || !couponCode.trim()}
                className="px-4 py-2.5 bg-black text-white rounded-xl text-sm font-bold font-['Hanken_Grotesk'] hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
              >
                {applyingCoupon ? '...' : 'Apply'}
              </button>
            </div>
          )}
          {couponError && <p className="text-xs text-red-600 font-medium">{couponError}</p>}

          {!contextCouponDiscount && availableCoupons.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Available Offers</span>
              <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                {availableCoupons.map((coupon, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyCouponClick(coupon.code)}
                    disabled={applyingCoupon || (coupon.minOrderAmount && subtotal < coupon.minOrderAmount)}
                    className="flex flex-col text-left bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 group"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-black text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-200 group-hover:border-gray-300">{coupon.code}</span>
                      <span className="text-xs font-bold text-gray-500 group-hover:text-black transition-colors">Apply</span>
                    </div>
                    {coupon.description && <p className="text-[11px] text-gray-500 mt-1.5 leading-tight">{coupon.description}</p>}
                    {coupon.minOrderAmount > subtotal && (
                      <p className="text-[10px] text-red-500 mt-1 font-medium">Add ₹{(coupon.minOrderAmount - subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })} more to unlock</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Totals Breakdown */}
        <div className="flex flex-col gap-[12px] font-['Hanken_Grotesk'] text-[15px] text-[#44474c]">
          {productDiscountSavings > 0 && (
            <div className="flex justify-between">
              <span>Total MRP (Regular Price)</span>
              <span className="font-medium text-gray-500 line-through">{formatPrice(mrpSubtotal)}</span>
            </div>
          )}

          {productDiscountSavings > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span className="font-semibold">Product Discount Savings</span>
              <span className="font-bold">-{formatPrice(productDiscountSavings)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Subtotal (Sale Price)</span>
            <span className="font-medium text-black">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-medium text-emerald-700">Free (Included)</span>
          </div>

          <div className="flex justify-between">
            <span>Taxes & Fees</span>
            <span className="font-medium text-emerald-700">Included in price</span>
          </div>

          {contextCouponDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span className="font-bold">Coupon Discount ({contextCouponCode})</span>
              <span className="font-bold">-{formatPrice(contextCouponDiscount)}</span>
            </div>
          )}
        </div>

        <div className="h-px bg-[#c4c6cc] w-full my-[24px]"></div>

        <div className="flex justify-between items-center font-['Liberation_Serif'] font-bold text-[24px] text-black">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {/* Savings Highlight Banner */}
        {totalSavings > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-emerald-900 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Total Savings on this Order:
            </span>
            <span className="text-sm font-extrabold text-emerald-700">{formatPrice(totalSavings)}</span>
          </div>
        )}

        {showCheckoutButton && cartItems.length > 0 && (
          <div className="mt-[24px]">
            {!canCheckout && (
              <div className="text-sm text-red-600 font-medium mb-3 text-center">
                Please select all required options for your items before checking out.
              </div>
            )}
            {canCheckout ? (
              <button 
                onClick={() => {
                  if (!session) {
                    toast.error("Please sign in or register to proceed to checkout!");
                    router.push(`/login?redirect=${encodeURIComponent('/checkout/shipping')}`);
                  } else {
                    router.push('/checkout/shipping');
                  }
                }}
                className="bg-[#004d34] text-white font-['Hanken_Grotesk'] font-medium text-[16px] py-[16px] px-[32px] rounded-full w-full hover:bg-[#003825] transition-colors flex justify-center items-center cursor-pointer"
              >
                Proceed to Checkout
              </button>
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
