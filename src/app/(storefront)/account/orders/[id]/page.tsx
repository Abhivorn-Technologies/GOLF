"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, Clock, MapPin, Star, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import AccountLogoutButton from "@/app/(storefront)/account/_components/AccountLogoutButton";
import AccountSidebar from "@/app/(storefront)/account/_components/AccountSidebar";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try {
        const res = await fetch(`/api/user/orders/${id}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Failed to fetch order details", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <main className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <main className="flex-1 flex flex-col justify-center items-center gap-4">
          <h2 className="text-2xl font-black uppercase">Order Not Found</h2>
          <button onClick={() => router.back()} className="text-gray-500 hover:text-black underline">Go Back</button>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <main className="flex-1">
        <div className="w-full px-4 md:px-8 pt-4 flex justify-end">
          <AccountLogoutButton />
        </div>
        <div className="w-full px-4 md:px-8 py-6 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <AccountSidebar />
          
          <div className="flex-1 w-full flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex flex-col gap-4">
              <Link href="/account/orders" className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-2 w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Orders
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-black text-black uppercase tracking-tighter">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h1>
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" /> 
                    Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full w-fit">
                  {order.shippingStatus || 'Processing'}
                </div>
              </div>
            </div>

            {/* Order Tracking Stepper */}
            {order.shippingStatus !== 'cancelled' ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-6">Order Tracking</h3>
                <div className="flex items-center w-full">
                  {[
                    { key: 'processing', label: 'Processing', icon: '📦' },
                    { key: 'shipped', label: 'Shipped', icon: '🚚' },
                    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵' },
                    { key: 'delivered', label: 'Delivered', icon: '✅' },
                  ].map((step, idx, arr) => {
                    const statusOrder = ['processing', 'shipped', 'out_for_delivery', 'delivered'];
                    const currentIdx = statusOrder.indexOf(order.shippingStatus);
                    const stepIdx = statusOrder.indexOf(step.key);
                    const isDone = stepIdx <= currentIdx;
                    const isCurrent = step.key === order.shippingStatus;
                    return (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                            isDone ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-300'
                          } ${isCurrent ? 'ring-4 ring-black/10 scale-110' : ''}`}>
                            {isDone ? step.icon : <span className="w-2 h-2 rounded-full bg-gray-300 block" />}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 text-center max-w-[70px] ${isDone ? 'text-black' : 'text-gray-400'}`}>
                            {step.label}
                          </span>
                        </div>
                        {idx < arr.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${stepIdx < currentIdx ? 'bg-black' : 'bg-gray-200'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                {order.estimatedDelivery && order.shippingStatus !== 'delivered' && (
                  <p className="text-xs text-gray-500 font-medium mt-4 text-center">
                    Estimated Delivery: <strong className="text-green-700">{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</strong>
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="font-bold text-red-800 uppercase tracking-wide text-sm">Order Cancelled</p>
                  {order.cancellationReason && <p className="text-xs text-red-600 mt-0.5">Reason: {order.cancellationReason}</p>}
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-black flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Shipping Address
                </h3>
                <div className="flex flex-col text-sm text-gray-600 gap-1">
                  <span className="font-bold text-black">{order.shippingAddress?.name || 'Customer'}</span>
                  <span>{order.shippingAddress?.street}</span>
                  <span>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</span>
                  <span className="mt-2 font-medium">T: {order.shippingAddress?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-black flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Payment Details
                </h3>
                <div className="flex flex-col text-sm text-gray-600 gap-1">
                  <span className="font-bold text-black uppercase">{order.paymentMethod || 'Razorpay'}</span>
                  {order.paymentStatus === 'paid' ? (
                    <span className="text-green-600 font-bold uppercase text-xs tracking-widest mt-1">Payment Successful</span>
                  ) : (
                    <span className="text-yellow-600 font-bold uppercase text-xs tracking-widest mt-1">Pending</span>
                  )}
                  {order.razorpayPaymentId && (
                     <span className="text-xs text-gray-400 mt-2">Ref: {order.razorpayPaymentId}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tracking (if available) */}
            {order.trackingId && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col gap-4">
                 <h3 className="font-bold text-sm uppercase tracking-widest text-green-800 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Delivery Information
                </h3>
                <div className="flex flex-col gap-1 text-sm text-green-900">
                   <span><strong>Courier:</strong> {order.courierName || 'Standard Shipping'}</span>
                   <span><strong>Tracking ID:</strong> {order.trackingId}</span>
                   <span><strong>Est. Delivery:</strong> {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}</span>
                </div>
              </div>
            )}

            {/* Cancel/Return Status */}
            {(order.shippingStatus === 'cancelled' || (order.returnStatus && order.returnStatus !== 'none')) ? (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col gap-4">
                 <h3 className="font-bold text-sm uppercase tracking-widest text-red-800 flex items-center gap-2">
                  Action Status
                </h3>
                <div className="flex flex-col gap-1 text-sm text-red-900">
                   {order.shippingStatus === 'cancelled' && (
                     <>
                      <span className="font-bold">Order Cancelled</span>
                      <span>Reason: {order.cancellationReason || 'Requested by customer'}</span>
                     </>
                   )}
                   {order.returnStatus && order.returnStatus !== 'none' && (
                     <>
                      <span className="font-bold">Return Status: {order.returnStatus.toUpperCase()}</span>
                      <span>Reason: {order.returnReason || 'Requested by customer'}</span>
                     </>
                   )}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {order.shippingStatus === 'processing' && (
                  <button 
                    onClick={async () => {
                      if(confirm('Are you sure you want to cancel this order?')) {
                        const reason = prompt('Please provide a reason for cancellation:');
                        if (reason !== null) {
                          await fetch('/api/user/orders', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderId: order._id, action: 'cancel', reason: reason || 'Customer requested cancellation' })
                          });
                          window.location.reload();
                        }
                      }
                    }}
                    className="px-6 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm uppercase tracking-widest"
                  >
                    Cancel Order
                  </button>
                )}
                {order.shippingStatus === 'delivered' && (!order.returnStatus || order.returnStatus === 'none') && (
                  <button 
                    onClick={async () => {
                      const reason = prompt('Please provide a reason for the return:');
                      if (reason) {
                        await fetch('/api/user/orders', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ orderId: order._id, action: 'return', reason })
                        });
                        window.location.reload();
                      }
                    }}
                    className="px-6 py-3 bg-white border border-gray-200 text-black font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm uppercase tracking-widest"
                  >
                    Request Return
                  </button>
                )}
                {/* Re-order button */}
                {order.products?.length > 0 && (
                  <button
                    onClick={() => {
                      const cartItems = order.products.map((item: any) => ({
                        product: { id: item.product?._id || item.product?.id, name: item.product?.title || item.product?.name, price: item.priceAtPurchase, image: (item.product?.images?.[0] || item.product?.image || ''), slug: item.product?.slug },
                        quantity: item.quantity,
                        variants: item.variants ? Object.fromEntries(Object.entries(item.variants)) : {}
                      }));
                      localStorage.setItem('golf_reorder', JSON.stringify(cartItems));
                      router.push('/cart?reorder=1');
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm uppercase tracking-widest"
                  >
                    <RotateCcw className="w-4 h-4" /> Re-order
                  </button>
                )}
                {/* Leave a Review */}
                {order.shippingStatus === 'delivered' && !order.feedback?.rating && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-bold rounded-xl hover:bg-amber-100 transition-colors text-sm uppercase tracking-widest"
                  >
                    <Star className="w-4 h-4" /> Leave a Review
                  </button>
                )}
                {order.feedback?.rating && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-amber-600 font-bold text-sm">Your Review:</span>
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= order.feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />)}
                  </div>
                )}
              </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl flex flex-col gap-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Leave a Review</h2>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setReviewForm(f => ({...f, rating: s}))}>
                        <Star className={`w-8 h-8 transition-colors ${s <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Share your experience (optional)..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(f => ({...f, comment: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        if (!reviewForm.rating) { toast.error('Please select a rating'); return; }
                        setSubmittingReview(true);
                        try {
                          const res = await fetch(`/api/user/orders/${order._id}/review`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(reviewForm)
                          });
                          if (res.ok) { toast.success('Review submitted!'); setShowReviewModal(false); window.location.reload(); }
                          else { const d = await res.json(); toast.error(d.error || 'Failed to submit'); }
                        } finally { setSubmittingReview(false); }
                      }}
                      disabled={submittingReview}
                      className="flex-1 bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button onClick={() => setShowReviewModal(false)} className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            <div className="flex flex-col">
              <h3 className="font-black text-xl text-black uppercase tracking-tight mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" /> Items in Order
              </h3>
              
              <div className="flex flex-col gap-6">
                {order.products?.map((item: any, idx: number) => {
                  const prodName = item.product?.name || item.product?.title || 'Unknown Product';
                  const prodImage = item.product?.image || (item.product?.images && item.product.images[0]) || '/placeholder.png';
                  
                  return (
                  <div key={idx} className="flex gap-6 items-center bg-white p-4 rounded-xl border border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 shrink-0">
                      <img src={prodImage.startsWith('http') ? prodImage : `/images/${prodImage}`} alt={prodName} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    
                    <div className="flex flex-col gap-1 flex-1">
                      <Link href={`/product/${item.product?.slug || item.product?._id}`} className="text-black font-bold tracking-tight hover:underline">
                        {prodName}
                      </Link>
                      
                      <span className="font-medium text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </span>
                    </div>

                    <div className="font-black text-lg text-black">
                      ₹{((item.priceAtPurchase || 0) * (item.quantity || 1)).toLocaleString()}
                    </div>
                  </div>
                )})}
              </div>
            </div>

            {/* Price Summary */}
            <div className="flex flex-col bg-gray-50 border border-gray-100 rounded-2xl p-6 mt-4 self-end w-full md:w-96">
               <h3 className="font-bold text-sm uppercase tracking-widest text-black mb-4">Price Summary</h3>
               <div className="flex flex-col gap-3 text-sm text-gray-600">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span className="font-semibold text-black">₹{(order.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Shipping</span>
                   <span className="font-semibold text-black">{order.shippingCost === 0 ? 'Free' : `₹${(order.shippingCost || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Taxes (18% GST)</span>
                   <span className="font-semibold text-black">₹{(order.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                 </div>
                 {order.discountAmount > 0 && (
                   <div className="flex justify-between text-green-700">
                     <span className="flex items-center gap-2">
                       Discount
                       {order.couponCode && (
                         <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                           {order.couponCode}
                         </span>
                       )}
                     </span>
                     <span className="font-semibold">-₹{order.discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                   </div>
                 )}
                 <div className="w-full h-px bg-gray-200 my-2"></div>
                 <div className="flex justify-between text-lg font-black text-black uppercase tracking-tight">
                   <span>Total</span>
                   <span>₹{(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
