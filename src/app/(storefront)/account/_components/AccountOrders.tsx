"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PackageOpen, X, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AccountOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          comment: reason.trim() // using reason as comment for feedback
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchOrders(); // Refresh orders
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

  return (
    <div className="w-full relative">
      <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-8">
        My Orders
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
          <p className="font-semibold text-sm">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10 text-center flex flex-col items-center">
          <PackageOpen className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1.5} />
          <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tighter">No Orders Yet</h3>
          <p className="font-medium text-gray-500 text-sm mb-8 max-w-md">
            Looks like you haven't placed any orders with us yet. Start shopping to fill this space!
          </p>
          <Link href="/" className="inline-block bg-black text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-md">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              
              {/* Order Header */}
              <div className="bg-gray-50 border-b border-gray-100 py-3 px-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-6 sm:gap-10">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                      Order Placed
                    </span>
                    <span className="font-semibold text-black text-sm">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                      Total Amount
                    </span>
                    <span className="font-semibold text-black text-sm">
                      ₹{order.totalAmount?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                      Ship To
                    </span>
                    <span className="font-semibold text-black text-sm hover:underline cursor-pointer">
                      {order.shippingAddress?.name || 'Customer'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 sm:items-end w-full sm:w-auto">
                  <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                    Order ID
                  </span>
                  <Link href={`/account/orders/${order._id}`} className="font-bold text-black text-sm hover:underline flex items-center gap-1">
                    #{order._id.slice(-8).toUpperCase()} <span className="text-gray-400">&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-6 items-start justify-between">
                
                <div className="flex flex-col gap-5 flex-1 w-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {order.shippingStatus || 'Processing'}
                      </div>
                      
                      {order.returnStatus && order.returnStatus !== 'none' && (
                         <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 text-[10px] font-bold uppercase tracking-widest rounded-full">
                          Return {order.returnStatus}
                        </div>
                      )}
                    </div>
                    
                    {order.trackingId && (
                      <div className="text-xs text-gray-500 mt-2">
                        <span className="font-bold text-gray-700">Courier:</span> {order.courierName || 'Standard Shipping'} <br/>
                        <span className="font-bold text-gray-700">Tracking ID:</span> {order.trackingId} <br/>
                        <span className="font-bold text-gray-700">Est. Delivery:</span> {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-6 w-full">
                    {order.products?.map((item: any, idx: number) => {
                      const prodName = item.product?.name || item.product?.title || 'Unknown Product';
                      const prodImage = item.product?.image || (item.product?.images && item.product.images[0]) || '/placeholder.png';
                      
                      return (
                      <div key={idx} className="flex gap-4 sm:gap-6 items-center">
                        <Link href={`/product/${item.product?.slug || item.product?._id}`} className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 sm:p-3 shrink-0 border border-gray-100 hover:border-black transition-colors">
                          <img src={prodImage.startsWith('http') ? prodImage : `/images/${prodImage}`} alt={prodName} className="w-full h-full object-contain mix-blend-multiply" />
                        </Link>
                        
                        <div className="flex flex-col gap-1 sm:gap-1.5 flex-1">
                          <Link href={`/product/${item.product?.slug || item.product?._id}`} className="text-black text-base sm:text-lg font-black tracking-tight leading-tight hover:underline hover:text-green-800">
                            {prodName}
                          </Link>
                          
                          <span className="font-medium text-gray-500 text-sm">
                            Qty: {item.quantity}
                          </span>

                          {item.variants && Object.keys(item.variants).length > 0 && (
                            <div className="text-xs text-gray-500 flex gap-2">
                              {Object.entries(item.variants).map(([k,v]) => (
                                <span key={k} className="bg-gray-100 px-2 py-1 rounded">{k}: {v as string}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0 lg:min-w-[220px]">
                  
                  <Link 
                    href={`/account/orders/${order._id}`}
                    className="w-full bg-black text-white rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md text-center"
                  >
                    View Details
                  </Link>

                  {order.shippingStatus === 'shipped' && (
                    <button 
                      onClick={() => order.trackingId ? alert(`Redirecting to ${order.courierName} tracking page for AWB: ${order.trackingId}`) : alert('Tracking not generated yet')}
                      className="w-full bg-black text-white rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md text-center"
                    >
                      Track Package
                    </button>
                  )}

                  {order.shippingStatus === 'processing' && (
                    <button 
                      onClick={() => openModal('cancel', order)}
                      className="w-full bg-white border border-gray-200 text-black rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-center"
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.shippingStatus === 'delivered' && order.returnStatus === 'none' && (
                    <button 
                      onClick={() => openModal('return', order)}
                      className="w-full bg-white border border-gray-200 text-black rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors text-center"
                    >
                      Return Items
                    </button>
                  )}

                  {order.shippingStatus === 'delivered' && !order.feedback?.rating && (
                    <button 
                      onClick={() => openModal('feedback', order)}
                      className="w-full bg-white border border-gray-200 text-black rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors text-center"
                    >
                      Seller Feedback
                    </button>
                  )}
                  
                  {order.feedback?.rating && (
                    <div className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-6 flex flex-col items-center justify-center gap-1">
                       <span className="font-bold text-[10px] text-gray-500 uppercase tracking-widest">You Rated</span>
                       <div className="flex text-yellow-500 gap-0.5">
                         {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < order.feedback.rating ? 'fill-yellow-500' : 'text-gray-300 fill-gray-300'}`} />
                         ))}
                       </div>
                    </div>
                  )}
                </div>

              </div>
              
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {modalType && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-black text-xl tracking-tight uppercase">
                {modalType === 'cancel' && 'Cancel Order'}
                {modalType === 'return' && 'Request Return'}
                {modalType === 'feedback' && 'Leave Feedback'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-black transition-colors bg-white p-2 rounded-full shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              {modalType === 'feedback' && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Rate your experience</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setRating(star)}
                        className={`transition-colors ${star <= rating ? 'text-yellow-500' : 'text-gray-200'}`}
                      >
                        <Star className={`w-8 h-8 ${star <= rating ? 'fill-yellow-500' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {modalType === 'feedback' ? 'Add a comment (Optional)' : 'Reason required'}
                </label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    modalType === 'cancel' ? 'Why are you cancelling?' :
                    modalType === 'return' ? 'Why are you returning these items?' :
                    'Tell us what you liked or didn\'t like...'
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all min-h-[120px] resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
              <button 
                onClick={closeModal}
                disabled={actionLoading}
                className="flex-1 px-6 py-3.5 bg-white border border-gray-200 text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={submitAction}
                disabled={actionLoading}
                className="flex-1 px-6 py-3.5 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {actionLoading ? (
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
