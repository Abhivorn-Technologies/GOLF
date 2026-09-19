"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CreditCard, Clock, MapPin, Star, RotateCcw, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AccountLogoutButton from "@/app/(storefront)/account/_components/AccountLogoutButton";
import AccountSidebar from "@/app/(storefront)/account/_components/AccountSidebar";

function resolveImg(src?: string) {
  if (!src || src === '/placeholder.png' || src === 'undefined' || src === 'null') return '/images/golf.png';
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) return src;
  return `/images/${src}`;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Custom Modal State for Cancel / Return (replacing native browser alerts)
  const [modalType, setModalType] = useState<'cancel' | 'return' | null>(null);
  const [modalReason, setModalReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const handleActionSubmit = async () => {
    if (!modalType || !order) return;
    if (!modalReason.trim()) {
      toast.error(`Please provide a reason for ${modalType === 'cancel' ? 'cancellation' : 'return'}`);
      return;
    }
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/user/orders/${order._id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: modalType,
          reason: modalReason.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Request updated');
        setModalType(null);
        setModalReason('');
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to process request');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setSubmittingAction(false);
    }
  };

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

    // Auto-poll status every 10s so user dashboard automatically updates when admin updates status
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
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
                    Estimated Delivery: <strong className="text-green-700">5–7 working days from order date ({new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })})</strong>
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

            {/* Delivery Information (Only when Tracking ID has been added by Admin) */}
            {order.trackingId && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col gap-4">
                 <h3 className="font-bold text-sm uppercase tracking-widest text-green-800 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Delivery Information
                </h3>
                <div className="flex flex-col gap-1 text-sm text-green-900">
                   {order.courierName && <span><strong>Courier:</strong> {order.courierName}</span>}
                   <span><strong>Tracking ID:</strong> {order.trackingId}</span>
                   <span><strong>Est. Delivery:</strong> 5–7 working days from order date</span>
                </div>
              </div>
            )}

            {/* Cancel / Return / Refund Status Banner */}
            {(order.shippingStatus === 'cancelled' || (order.returnStatus && order.returnStatus !== 'none')) ? (
              <div className={`rounded-2xl p-6 flex flex-col gap-4 border ${
                order.shippingStatus === 'cancelled'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : order.returnStatus === 'approved' || order.returnStatus === 'refunded' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : order.returnStatus === 'rejected'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                 <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  {order.shippingStatus === 'cancelled' 
                    ? '🚫 Order Cancelled' 
                    : order.returnStatus === 'refunded'
                    ? '✅ Return Refunded'
                    : order.returnStatus === 'approved'
                    ? '✅ Return Approved - Refund Processing'
                    : order.returnStatus === 'rejected'
                    ? '❌ Return Request Rejected'
                    : '⏳ Return Under Review'}
                </h3>
                <div className="flex flex-col gap-1 text-sm">
                   {order.shippingStatus === 'cancelled' && (
                     <>
                      <span className="font-bold">Cancellation Reason: {order.cancellationReason || 'Requested by customer'}</span>
                     </>
                   )}
                   {order.returnStatus && order.returnStatus !== 'none' && (
                     <>
                      <span className="font-bold">Return Status: {order.returnStatus.toUpperCase()}</span>
                      <span>Reason: {order.returnReason || 'Requested by customer'}</span>
                     </>
                   )}
                   {Number(order.refundAmount) > 0 ? (
                     <div className="mt-2 p-3 bg-white/80 rounded-xl border border-emerald-200 font-bold text-sm text-emerald-800 flex items-center justify-between">
                       <span>Refund Processed:</span>
                       <span>₹{Number(order.refundAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                     </div>
                   ) : order.paymentStatus === 'paid' ? (
                     <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 font-bold text-xs text-amber-800 flex items-center justify-between">
                       <span>Refund Status:</span>
                       <span>⏳ Pending Admin Approval</span>
                     </div>
                   ) : null}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {order.shippingStatus === 'processing' && (
                  <button 
                    onClick={() => {
                      setModalReason('');
                      setModalType('cancel');
                    }}
                    className="px-6 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm uppercase tracking-widest"
                  >
                    Cancel Order
                  </button>
                )}
                {order.shippingStatus === 'delivered' && (!order.returnStatus || order.returnStatus === 'none') && (() => {
                  const deliveredTime = new Date(order.updatedAt || order.createdAt).getTime();
                  const returnWindowMs = 7 * 24 * 60 * 60 * 1000;
                  const isWithin7Days = (Date.now() - deliveredTime) <= returnWindowMs;

                  if (isWithin7Days) {
                    return (
                      <button 
                        onClick={() => {
                          setModalReason('');
                          setModalType('return');
                        }}
                        className="px-6 py-3 bg-white border border-gray-200 text-black font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm uppercase tracking-widest"
                      >
                        Request Return
                      </button>
                    );
                  }

                  return (
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 text-gray-400 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" title="7-day return policy expired">
                      <span>Return window expired (7-day policy)</span>
                    </div>
                  );
                })()}
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

            {/* Custom Cancel / Return Action Modal */}
            {modalType && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl flex flex-col gap-5 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase tracking-tight text-black">
                      {modalType === 'cancel' ? 'Cancel Order' : 'Request Return'}
                    </h2>
                    <button 
                      onClick={() => setModalType(null)}
                      className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 font-medium">
                    {modalType === 'cancel' 
                      ? 'Are you sure you want to cancel this order? Please provide your reason below.' 
                      : 'Please provide the reason for your return request.'}
                  </p>

                  <textarea
                    rows={4}
                    placeholder={modalType === 'cancel' ? 'Reason for cancellation...' : 'Reason for return...'}
                    value={modalReason}
                    onChange={(e) => setModalReason(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-sm outline-none focus:border-black resize-none bg-gray-50 focus:bg-white transition-all font-medium text-gray-900"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleActionSubmit}
                      disabled={submittingAction}
                      className={`flex-1 ${modalType === 'cancel' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'} text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50`}
                    >
                      {submittingAction ? 'Submitting...' : (modalType === 'cancel' ? 'Confirm Cancellation' : 'Submit Return')}
                    </button>
                    <button 
                      onClick={() => setModalType(null)}
                      disabled={submittingAction}
                      className="px-5 py-3.5 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
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
                  const prodName = typeof item.product === 'object' ? (item.product?.title || item.product?.name) : (item.title || item.name || 'Unknown Product');
                  const rawImage = typeof item.product === 'object' 
                    ? (item.product?.image || (Array.isArray(item.product?.images) ? item.product.images[0] : null))
                    : (item.image || (Array.isArray(item.images) ? item.images[0] : null));
                  
                  return (
                  <div key={idx} className="flex gap-6 items-center bg-white p-4 rounded-xl border border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 shrink-0">
                      <img 
                        src={resolveImg(rawImage)} 
                        alt={prodName} 
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/golf.png'; }}
                        className="w-full h-full object-contain mix-blend-multiply" 
                      />
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
