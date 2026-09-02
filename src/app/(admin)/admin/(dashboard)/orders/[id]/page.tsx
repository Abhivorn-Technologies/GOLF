"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, CreditCard, User, Truck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingForm, setTrackingForm] = useState({ trackingId: '', courierName: '', estimatedDelivery: '' });
  const [savingTracking, setSavingTracking] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [processingReturn, setProcessingReturn] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Failed to fetch order details", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingStatus: newStatus })
      });
      if (res.ok) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrder();
      } else {
        toast.error('Failed to update status');
      }
    } catch (e) {
      toast.error('An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  const updateTracking = async () => {
    setSavingTracking(true);
    try {
      const payload: any = {};
      if (trackingForm.trackingId) payload.trackingId = trackingForm.trackingId;
      if (trackingForm.courierName) payload.courierName = trackingForm.courierName;
      if (trackingForm.estimatedDelivery) payload.estimatedDelivery = trackingForm.estimatedDelivery;
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) { toast.success('Tracking info updated'); fetchOrder(); }
      else toast.error('Failed to update tracking');
    } catch { toast.error('An error occurred'); }
    finally { setSavingTracking(false); }
  };

  const processReturn = async (action: 'approved' | 'rejected') => {
    setProcessingReturn(true);
    try {
      const payload: any = { returnStatus: action };
      if (action === 'approved' && refundAmount) payload.refundAmount = parseFloat(refundAmount);
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) { toast.success(`Return ${action}`); fetchOrder(); }
      else toast.error('Failed to update return');
    } catch { toast.error('An error occurred'); }
    finally { setProcessingReturn(false); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <h2 className="text-2xl font-black uppercase tracking-tight">Order Not Found</h2>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-black font-semibold">
          &larr; Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/admin/orders" className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-2 w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders List
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black text-black uppercase tracking-tighter">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" /> 
              {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Update Status:</span>
            <select 
              value={order.shippingStatus}
              disabled={updating}
              onChange={(e) => updateStatus(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-black outline-none focus:border-black transition-colors disabled:opacity-50"
            >
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Details (Left 2 columns) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Products */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <h3 className="font-black text-lg text-black uppercase tracking-tight mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" /> Items Ordered
            </h3>
            
            <div className="flex flex-col gap-4">
              {order.products?.map((item: any, idx: number) => {
                const prodName = item.product?.name || item.product?.title || 'Unknown Product';
                const prodImage = item.product?.image || (item.product?.images && item.product.images[0]) || '/placeholder.png';
                
                return (
                <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100">
                    <img src={prodImage.startsWith('http') ? prodImage : `/images/${prodImage}`} alt={prodName} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-black font-bold uppercase tracking-tight text-sm">
                      {prodName}
                    </span>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      <span>Qty: {item.quantity}</span>
                      {item.product?.category === 'shoes' || item.product?.category === 'apparel' ? (
                        <span>Size: {item.product?.size || 'M'}</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="font-black text-black">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </div>
                </div>
              )})}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>₹{(order.subtotal || order.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Shipping</span>
                <span>{order.shippingCost ? `₹${order.shippingCost.toLocaleString('en-IN')}` : 'Free'}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Taxes (18% GST)</span>
                <span>₹{(order.taxAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg text-black font-black uppercase tracking-tight mt-2">
                <span>Total</span>
                <span>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Info (Right 1 column) */}
        <div className="flex flex-col gap-6">
          
          {/* Customer Details */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <User className="w-4 h-4 text-black" /> Customer Info
            </h3>
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-bold text-black">{order.shippingAddress?.name || 'Guest Checkout'}</span>
              <span className="text-gray-500">{order.customerEmail}</span>
              <span className="text-gray-500 mt-1">Phone: {order.shippingAddress?.phone || 'N/A'}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-black" /> Delivery Address
            </h3>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span className="font-bold text-black">{order.shippingAddress?.name}</span>
              <span>{order.shippingAddress?.houseNumber ? `${order.shippingAddress.houseNumber}, ` : ''}{order.shippingAddress?.street}</span>
              {order.shippingAddress?.area && <span>Area / Locality: {order.shippingAddress.area}</span>}
              {order.shippingAddress?.landmark && <span>Landmark: {order.shippingAddress.landmark}</span>}
              <span>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-black" /> Payment Status
            </h3>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span className="font-bold text-black uppercase">{order.paymentMethod || 'Razorpay'}</span>
              {order.paymentStatus === 'paid' ? (
                <span className="text-green-600 font-bold uppercase text-xs tracking-widest mt-1">Paid Successfully</span>
              ) : (
                <span className="text-yellow-600 font-bold uppercase text-xs tracking-widest mt-1">Pending</span>
              )}
              {order.razorpayPaymentId && (
                 <span className="text-[11px] text-gray-400 mt-2 font-mono bg-gray-50 p-2 rounded-lg break-all">
                   {order.razorpayPaymentId}
                 </span>
              )}
            </div>
          </div>

          {/* Tracking Update Form */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Truck className="w-4 h-4 text-black" /> Update Tracking
            </h3>
            {order.trackingId && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <p><strong>Current ID:</strong> {order.trackingId}</p>
                <p><strong>Courier:</strong> {order.courierName || 'N/A'}</p>
                <p><strong>Est. Delivery:</strong> {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Tracking ID (AWB)"
                value={trackingForm.trackingId}
                onChange={(e) => setTrackingForm(f => ({ ...f, trackingId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
              />
              <input
                type="text"
                placeholder="Courier name"
                value={trackingForm.courierName}
                onChange={(e) => setTrackingForm(f => ({ ...f, courierName: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
              />
              <input
                type="date"
                value={trackingForm.estimatedDelivery}
                onChange={(e) => setTrackingForm(f => ({ ...f, estimatedDelivery: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
              />
              <button
                onClick={updateTracking}
                disabled={savingTracking}
                className="w-full bg-black text-white rounded-xl py-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {savingTracking ? 'Saving...' : 'Save Tracking'}
              </button>
            </div>
          </div>

          {/* Cancel / Return Action Panel */}
          {(order.shippingStatus === 'cancelled' || (order.returnStatus && order.returnStatus !== 'none')) && (
            <div className={`p-6 rounded-[24px] flex flex-col gap-4 ${order.returnStatus === 'requested' ? 'bg-orange-50 border border-orange-100' : 'bg-red-50 border border-red-100'}`}>
              <h3 className="font-bold text-xs uppercase tracking-widest text-red-800">
                {order.returnStatus === 'requested' ? '⚠️ Return Requested' : 'Cancellation / Return'}
              </h3>
              <div className="flex flex-col gap-1 text-sm text-red-900">
                {order.shippingStatus === 'cancelled' && (
                  <>
                    <span className="font-bold">Customer Cancelled</span>
                    <span className="text-xs">Reason: {order.cancellationReason || 'N/A'}</span>
                  </>
                )}
                {order.returnStatus && order.returnStatus !== 'none' && (
                  <>
                    <span className="font-bold uppercase">Return: {order.returnStatus}</span>
                    <span className="text-xs">Reason: {order.returnReason || 'N/A'}</span>
                    {order.refundAmount && (
                      <span className="text-xs font-bold text-green-700 mt-1">Refund: ₹{order.refundAmount.toLocaleString()}</span>
                    )}
                  </>
                )}
              </div>

              {order.returnStatus === 'requested' && (
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="number"
                    placeholder="Refund amount (₹)"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => processReturn('approved')}
                      disabled={processingReturn}
                      className="flex-1 bg-green-600 text-white rounded-xl py-2 text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => processReturn('rejected')}
                      disabled={processingReturn}
                      className="flex-1 bg-red-600 text-white rounded-xl py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
