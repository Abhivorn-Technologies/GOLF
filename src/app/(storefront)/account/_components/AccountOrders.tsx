"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, PackageOpen, X, Star, ChevronRight, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function resolveImg(src?: string) {
  if (!src || src === '/placeholder.png' || src === 'undefined' || src === 'null') return '/images/golf.png';
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) return src;
  return `/images/${src}`;
}

export default function AccountOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'processing' | 'delivered' | 'cancelled'>('all');

  // Modal State
  const [modalType, setModalType] = useState<'cancel' | 'return' | 'feedback' | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [rating, setRating] = useState(5);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/user/orders');
      const data = await res.json();
      
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch user orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (type: 'cancel' | 'return' | 'feedback', order: any) => {
    setModalType(type);
    setSelectedOrder(order);
    setReason('');
    setRating(5);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedOrder(null);
  };

  const submitAction = async () => {
    if (!selectedOrder || !modalType) return;
    
    if ((modalType === 'cancel' || modalType === 'return') && !reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/user/orders/${selectedOrder._id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: modalType,
          reason: reason.trim(),
          rating,
          comment: reason.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchOrders();
        closeModal();
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to submit action');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'processing') return order.shippingStatus === 'processing' || order.shippingStatus === 'shipped';
    if (filter === 'delivered') return order.shippingStatus === 'delivered';
    if (filter === 'cancelled') return order.shippingStatus === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="w-full font-sans space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Order History</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Track your orders, view receipts, and manage returns</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl shrink-0 overflow-x-auto">
          {(['all', 'processing', 'delivered', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                filter === tab 
                  ? 'bg-white text-zinc-900 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {tab === 'all' ? 'All Orders' : tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-16 border border-gray-100 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 text-sm font-medium">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-zinc-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">No Orders Found</h3>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm">
            {filter === 'all' 
              ? "You haven't placed any orders yet. Explore our latest golf collections!"
              : `No orders matching status "${filter}".`}
          </p>
          <Link href="/" className="bg-zinc-900 hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
            Browse Store
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              
              {/* Order Header Bar */}
              <div className="bg-zinc-50/70 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6 text-xs">
                  <div>
                    <span className="text-zinc-400 font-medium block uppercase tracking-wider text-[10px]">Date Placed</span>
                    <span className="font-semibold text-zinc-900 mt-0.5 block">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 font-medium block uppercase tracking-wider text-[10px]">Total Amount</span>
                    <span className="font-bold text-zinc-900 mt-0.5 block text-sm">
                      ₹{order.totalAmount?.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 font-medium block uppercase tracking-wider text-[10px]">Ship To</span>
                    <span className="font-medium text-zinc-800 mt-0.5 block truncate max-w-[150px]">
                      {order.shippingAddress?.name || 'Customer'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {order.returnStatus === 'refunded' || (order.shippingStatus === 'cancelled' && Number(order.refundAmount) > 0) ? (
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Refunded ₹{Number(order.refundAmount).toLocaleString('en-IN')}
                    </span>
                  ) : order.returnStatus === 'approved' ? (
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      Return Approved - Refund Processing
                    </span>
                  ) : order.returnStatus === 'requested' ? (
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Return Requested
                    </span>
                  ) : order.shippingStatus === 'cancelled' && order.paymentStatus === 'paid' ? (
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Refund Pending
                    </span>
                  ) : null}
                  {getStatusBadge(order.shippingStatus)}
                  <Link 
                    href={`/account/orders/${order._id}`} 
                    className="text-xs font-bold text-zinc-700 hover:text-black flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-gray-200 transition-colors shadow-2xs"
                  >
                    #{order._id.slice(-8).toUpperCase()}
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  </Link>
                </div>
              </div>

              {/* Order Products List */}
              <div className="p-6 flex flex-col md:flex-row gap-6 items-start justify-between">
                
                <div className="flex-1 space-y-4 w-full">
                  {order.products?.map((item: any, idx: number) => {
                    const prodName = typeof item.product === 'object' ? (item.product?.title || item.product?.name) : (item.title || item.name || 'Golf Equipment');
                    const rawImage = typeof item.product === 'object' 
                      ? (item.product?.image || (Array.isArray(item.product?.images) ? item.product.images[0] : null))
                      : (item.image || (Array.isArray(item.images) ? item.images[0] : null));
                    
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <Link href={`/product/${item.product?.slug || item.product?._id || ''}`} className="w-16 h-16 bg-zinc-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100 hover:border-zinc-300 transition-colors overflow-hidden">
                          <img 
                            src={resolveImg(rawImage)} 
                            alt={prodName} 
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/golf.png'; }}
                            className="w-full h-full object-contain mix-blend-multiply" 
                          />
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.product?.slug || item.product?._id}`} className="font-bold text-zinc-900 text-sm hover:text-emerald-700 transition-colors line-clamp-1">
                            {prodName}
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                            <span>Qty: <strong>{item.quantity}</strong></span>
                            <span>•</span>
                            <span>Price: <strong>₹{item.priceAtPurchase?.toLocaleString() || 'N/A'}</strong></span>
                          </div>

                          {item.variants && Object.keys(item.variants).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {Object.entries(item.variants)
                                .filter(([k]) => k !== 'variantId')
                                .map(([k, v]) => (
                                  <span key={k} className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md">
                                    {k}: {v as string}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Action Buttons */}
                <div className="w-full md:w-48 shrink-0 flex flex-col gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <Link 
                    href={`/account/orders/${order._id}`}
                    className="w-full bg-zinc-900 hover:bg-black text-white rounded-xl py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-xs"
                  >
                    View Order Details
                  </Link>

                  {order.shippingStatus === 'processing' && (
                    <button 
                      onClick={() => openModal('cancel', order)}
                      className="w-full bg-white border border-rose-200 text-rose-600 rounded-xl py-2.5 px-4 font-bold text-xs uppercase tracking-wider hover:bg-rose-50 transition-colors text-center"
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.shippingStatus === 'delivered' && (order.returnStatus === 'none' || !order.returnStatus) && (() => {
                    const deliveredTime = new Date(order.updatedAt || order.createdAt).getTime();
                    const returnWindowMs = 7 * 24 * 60 * 60 * 1000;
                    const isWithin7Days = (Date.now() - deliveredTime) <= returnWindowMs;

                    if (isWithin7Days) {
                      return (
                        <button 
                          onClick={() => openModal('return', order)}
                          className="w-full bg-white border border-gray-200 text-zinc-800 rounded-xl py-2.5 px-4 font-bold text-xs uppercase tracking-wider hover:bg-zinc-50 transition-colors text-center"
                        >
                          Request Return
                        </button>
                      );
                    }

                    return (
                      <span className="text-[11px] text-zinc-400 font-medium text-center py-1 italic">
                        Return period expired (7-day policy)
                      </span>
                    );
                  })()}

                  {order.shippingStatus === 'delivered' && !order.feedback?.rating && (
                    <button 
                      onClick={() => openModal('feedback', order)}
                      className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl py-2.5 px-4 font-bold text-xs uppercase tracking-wider hover:bg-emerald-100 transition-colors text-center flex items-center justify-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" /> Leave Feedback
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {modalType && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-zinc-50">
              <h3 className="font-bold text-zinc-900 text-base">
                {modalType === 'cancel' && 'Cancel Order'}
                {modalType === 'return' && 'Request Return'}
                {modalType === 'feedback' && 'Leave Feedback'}
              </h3>
              <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-900 transition-colors p-1.5 bg-white rounded-full border border-gray-200 shadow-2xs">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {modalType === 'feedback' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  {modalType === 'feedback' ? 'Comments (Optional)' : 'Reason'}
                </label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    modalType === 'cancel' ? 'Why are you cancelling?' :
                    modalType === 'return' ? 'Why are you returning these items?' :
                    'Tell us about your experience...'
                  }
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 transition-all min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div className="p-5 bg-zinc-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={closeModal}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-100 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={submitAction}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
