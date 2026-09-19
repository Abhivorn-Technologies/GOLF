"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  User, 
  Truck, 
  Clock, 
  Printer, 
  X, 
  CheckCircle2, 
  Phone, 
  ShieldCheck, 
  Save,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import Barcode from '@/components/admin/Barcode';

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [trackingForm, setTrackingForm] = useState({ 
    trackingId: '', 
    courierName: '', 
    deliveryAgentName: '',
    deliveryAgentPhone: '',
    estimatedDelivery: '' 
  });
  const [savingTracking, setSavingTracking] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [processingReturn, setProcessingReturn] = useState(false);
  const [showPrintSlip, setShowPrintSlip] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
        setTrackingForm({
          trackingId: data.order.trackingId || '',
          courierName: data.order.courierName || '',
          deliveryAgentName: data.order.deliveryAgentName || '',
          deliveryAgentPhone: data.order.deliveryAgentPhone || '',
          estimatedDelivery: data.order.estimatedDelivery ? new Date(data.order.estimatedDelivery).toISOString().substring(0, 10) : ''
        });
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
        toast.success(`Order status updated to ${newStatus}`);
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
      const payload: any = {
        trackingId: trackingForm.trackingId,
        courierName: trackingForm.courierName,
        deliveryAgentName: trackingForm.deliveryAgentName,
        deliveryAgentPhone: trackingForm.deliveryAgentPhone,
        estimatedDelivery: trackingForm.estimatedDelivery || null
      };

      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) { 
        toast.success('Courier & Delivery Agent details saved!'); 
        fetchOrder(); 
      } else {
        toast.error('Failed to update delivery info'); 
      }
    } catch { 
      toast.error('An error occurred'); 
    } finally { 
      setSavingTracking(false); 
    }
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

  const handlePrint = () => {
    window.print();
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
      <div className="flex flex-col gap-4 print:hidden">
        <Link href="/admin/orders" className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-2 w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders List
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-black uppercase tracking-tighter">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.shippingStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                order.shippingStatus === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                order.shippingStatus === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' :
                order.shippingStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {order.shippingStatus?.replace(/_/g, ' ')}
              </span>
            </div>
            <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" /> 
              {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowPrintSlip(true)}
              className="px-4 py-2.5 bg-black text-white hover:bg-gray-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Package Slip / Label
            </button>

            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-2">Status:</span>
              <select 
                value={order.shippingStatus}
                disabled={updating}
                onChange={(e) => updateStatus(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-black outline-none focus:border-black transition-colors disabled:opacity-50"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        
        {/* Main Details (Left 2 columns) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Products */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <h3 className="font-black text-lg text-black uppercase tracking-tight mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" /> Items Ordered
            </h3>
            
            <div className="flex flex-col gap-4">
              {order.products?.map((item: any, idx: number) => {
                const prodObj = item.product && typeof item.product === 'object' ? item.product : null;
                const prodName = prodObj?.name || prodObj?.title || 'Product Item';
                const rawImg = prodObj?.image || (Array.isArray(prodObj?.images) ? prodObj.images[0] : null) || item.image || '';
                
                let prodImage = '/images/golf.png';
                if (rawImg && typeof rawImg === 'string' && rawImg.trim() !== '') {
                  const clean = rawImg.trim();
                  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:') || clean.startsWith('/')) {
                    prodImage = clean;
                  } else {
                    prodImage = `/images/${clean}`;
                  }
                }
                
                return (
                <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100 overflow-hidden">
                    <img 
                      src={prodImage} 
                      alt={prodName} 
                      className="w-full h-full object-contain mix-blend-multiply" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          target.src = '/images/golf.png';
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-black font-bold uppercase tracking-tight text-sm">
                      {prodName}
                    </span>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      <span>Qty: {item.quantity}</span>
                    </div>
                    
                    {item.variants && Object.keys(item.variants).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(item.variants)
                          .filter(([k]) => k !== 'variantId')
                          .map(([k,v]) => (
                          <span key={k} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">{k}: {v as string}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="font-black text-black">
                    ₹{((item.priceAtPurchase || item.price || 0) * (item.quantity || 1)).toLocaleString()}
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

          {/* Delivery Agent & Courier Assignment Card */}
          <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-black flex items-center gap-2">
                <Truck className="w-5 h-5 text-black" /> Delivery Partner & Agent Assignment
              </h3>
              <span className="text-xs text-gray-400 font-medium">Prints on shipping slip</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); updateTracking(); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    value={trackingForm.courierName}
                    onChange={(e) => setTrackingForm({ ...trackingForm, courierName: e.target.value })}
                    placeholder="e.g., BlueDart / Delhivery / Express"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    AWB / Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingForm.trackingId}
                    onChange={(e) => setTrackingForm({ ...trackingForm, trackingId: e.target.value })}
                    placeholder="e.g., AWB987654321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-black outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Delivery Agent Name
                  </label>
                  <input
                    type="text"
                    value={trackingForm.deliveryAgentName}
                    onChange={(e) => setTrackingForm({ ...trackingForm, deliveryAgentName: e.target.value })}
                    placeholder="e.g., Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Delivery Agent Phone
                  </label>
                  <input
                    type="text"
                    value={trackingForm.deliveryAgentPhone}
                    onChange={(e) => setTrackingForm({ ...trackingForm, deliveryAgentPhone: e.target.value })}
                    placeholder="e.g., +91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={trackingForm.estimatedDelivery}
                  onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDelivery: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-black outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingTracking}
                  className="px-5 py-2.5 bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingTracking ? 'Saving...' : 'Save Delivery & Courier Info'}
                </button>
              </div>
            </form>
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
              <MapPin className="w-4 h-4 text-black" /> Delivery Address (Ship To)
            </h3>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span className="font-bold text-black">{order.shippingAddress?.name}</span>
              <span>{order.shippingAddress?.houseNumber ? `${order.shippingAddress.houseNumber}, ` : ''}{order.shippingAddress?.street}</span>
              {order.shippingAddress?.area && <span>Area / Locality: {order.shippingAddress.area}</span>}
              {order.shippingAddress?.landmark && <span>Landmark: {order.shippingAddress.landmark}</span>}
              <span>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</span>
              <span className="font-bold text-black mt-2 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {order.shippingAddress?.phone || 'N/A'}
              </span>
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
                <span className="text-emerald-700 font-bold uppercase text-xs tracking-widest mt-1 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Paid Online (Prepaid)
                </span>
              ) : (
                <span className="text-amber-600 font-bold uppercase text-xs tracking-widest mt-1">Pending (Cash on Delivery)</span>
              )}
              {order.razorpayPaymentId && (
                 <span className="text-[11px] text-gray-400 mt-2 font-mono bg-gray-50 p-2 rounded-lg break-all">
                   {order.razorpayPaymentId}
                 </span>
              )}
            </div>
          </div>

          {/* Cancel / Return Action Panel */}
          {(order.shippingStatus === 'cancelled' || (order.returnStatus && order.returnStatus !== 'none')) && (
            <div className={`p-6 rounded-[24px] flex flex-col gap-4 ${order.returnStatus === 'requested' ? 'bg-orange-50 border border-orange-100' : 'bg-red-50 border border-red-100'}`}>
              <h3 className="font-bold text-xs uppercase tracking-widest text-red-800">
                {order.returnStatus === 'requested' ? '⚠️ Return Requested' : (order.shippingStatus === 'cancelled' ? 'Order Cancelled' : 'Return Request')}
              </h3>
              <div className="flex flex-col gap-1 text-sm text-red-900">
                {order.shippingStatus === 'cancelled' && (
                  <>
                    <span className="font-bold">Cancellation Reason:</span>
                    <span className="text-xs bg-white/70 p-2 rounded-lg border border-red-100">{order.cancellationReason || 'Requested by customer'}</span>
                  </>
                )}
                {order.returnStatus && order.returnStatus !== 'none' && (
                  <>
                    <span className="font-bold uppercase">Return Status: {order.returnStatus}</span>
                    <span className="text-xs">Reason: {order.returnReason || 'Requested by customer'}</span>
                  </>
                )}
                {order.refundAmount ? (
                  <div className="mt-2 p-3 bg-green-100 border border-green-200 rounded-xl text-green-900 font-bold text-xs flex items-center justify-between">
                    <span>Refund Amount:</span>
                    <span>₹{order.refundAmount.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-gray-500 mt-1">No refund processed yet.</span>
                )}
              </div>

              {/* Action Form for Returns */}
              {order.returnStatus === 'requested' && (
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="number"
                    placeholder={`Refund amount (Default: ₹${order.totalAmount})`}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => processReturn('approved')}
                      disabled={processingReturn}
                      className="flex-1 bg-green-600 text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Approve Return
                    </button>
                    <button
                      onClick={() => processReturn('rejected')}
                      disabled={processingReturn}
                      className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Reject Return
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customer Rating & Review Card */}
          {order.feedback?.rating ? (
            <div className="bg-amber-50/60 border border-amber-200/80 p-6 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-widest text-amber-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" /> Customer Review & Rating
              </h3>
              
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-4 h-4 ${s <= order.feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-xs font-bold text-amber-900 ml-2">{order.feedback.rating} / 5 Stars</span>
              </div>

              {order.feedback.comment ? (
                <p className="text-xs text-amber-950 font-medium leading-relaxed italic bg-white/80 p-3 rounded-xl border border-amber-200/60">
                  &ldquo;{order.feedback.comment}&rdquo;
                </p>
              ) : (
                <p className="text-xs text-amber-700 italic">No comment provided.</p>
              )}

              {order.feedback.createdAt && (
                <span className="text-[10px] text-amber-700 block">
                  Reviewed on {new Date(order.feedback.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ) : (
            order.shippingStatus === 'delivered' && (
              <div className="bg-gray-50 border border-gray-200/80 p-5 rounded-[24px] text-xs text-gray-500 flex items-center justify-between">
                <span className="font-medium">Customer Review:</span>
                <span className="text-gray-400 italic">Awaiting customer rating</span>
              </div>
            )
          )}

        </div>
      </div>

      {/* PRINTABLE PACKAGE SHIPPING SLIP / DISPATCH LABEL MODAL */}
      {showPrintSlip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Sticky Top Control Header (Hidden when printing) */}
            <div className="bg-gray-900 text-white p-4 px-6 flex items-center justify-between shrink-0 sticky top-0 z-50 border-b border-gray-800 print:hidden">
              <span className="text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" /> Lorven Golf Package Shipping Slip
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-extrabold uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  title="Save as PDF or Print on Label Printer"
                >
                  <Printer className="w-4 h-4" /> Download PDF / Print
                </button>

                <button 
                  onClick={() => setShowPrintSlip(false)} 
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-4 h-4" /> Close
                </button>
              </div>
            </div>

            {/* Scrollable Printable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
              {/* PRINTABLE SLIP CONTENT */}
              <div className="p-6 md:p-8 bg-white text-black space-y-6 border-4 border-black rounded-xl shadow-sm" id="printable-shipping-slip">
                {/* Header Banner */}
                <div className="border-b-4 border-black pb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">LORVEN GOLF DISPATCH SLIP</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-700">PACKAGE SHIPPING LABEL</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase">ORDER ID</div>
                    <div className="text-xl font-mono font-black text-black">#{order._id.slice(-8).toUpperCase()}</div>
                    <div className="text-[11px] text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* SCANNABLE CODE128 BARCODE */}
                <div className="bg-white p-2 rounded-lg border border-gray-300 text-center flex flex-col items-center justify-center">
                  <Barcode value={order._id.toUpperCase()} height={50} fontSize={13} />
                </div>

                {/* SHIP FROM vs SHIP TO */}
                <div className="grid grid-cols-2 gap-4 border-t-2 border-b-2 border-black py-4">
                  {/* SHIP FROM (Warehouse) */}
                  <div className="pr-2 border-r border-gray-300 space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 block">SHIP FROM (RETURN ADDRESS):</span>
                    <p className="font-bold text-xs uppercase text-black">LORVEN GOLF FULFILLMENT HUB</p>
                    <p className="text-xs text-gray-700">101 Lorven Golf Club Avenue, Tech Park Phase 2</p>
                    <p className="text-xs text-gray-700">Bangalore, Karnataka - 560001</p>
                    <p className="text-xs font-semibold text-gray-800">Phone: +91 98765 43210</p>
                  </div>

                  {/* SHIP TO (Customer Address) */}
                  <div className="pl-2 space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-black block bg-black text-white px-2 py-0.5 rounded w-fit">
                      SHIP TO (DELIVERY ADDRESS):
                    </span>
                    <p className="font-extrabold text-sm uppercase text-black">{order.shippingAddress?.name}</p>
                    <p className="text-xs font-medium text-black">
                      {order.shippingAddress?.houseNumber ? `${order.shippingAddress.houseNumber}, ` : ''}{order.shippingAddress?.street}
                    </p>
                    {order.shippingAddress?.area && <p className="text-xs text-gray-700">{order.shippingAddress.area}</p>}
                    {order.shippingAddress?.landmark && <p className="text-xs text-gray-700">Landmark: {order.shippingAddress.landmark}</p>}
                    <p className="text-xs font-bold text-black uppercase">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}
                    </p>
                    <p className="text-xs font-extrabold text-black pt-1">
                      📞 CONTACT: {order.shippingAddress?.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* COURIER & LOGISTICS DETAILS */}
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">LOGISTICS / TRANSPORT</span>
                    <span className="font-extrabold text-black text-sm">{order.courierName || trackingForm.courierName || 'In-House Logistics'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">AWB / TRACKING ID</span>
                    <span className="font-mono font-extrabold text-black text-sm">{order.trackingId || trackingForm.trackingId || `LOG-${order._id.slice(-6).toUpperCase()}`}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">DELIVERY AGENT</span>
                    <span className="font-bold text-black">{order.deliveryAgentName || trackingForm.deliveryAgentName || 'Assigned Agent'}</span>
                    {order.deliveryAgentPhone && <div className="text-[11px] font-semibold text-gray-700">{order.deliveryAgentPhone}</div>}
                  </div>
                </div>

                {/* PACKAGE CONTENTS TABLE */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700">PACKAGE CONTENT LIST ({order.products?.length} ITEM(S)):</span>
                  <table className="w-full text-left border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-gray-200 border-b border-gray-300 uppercase font-bold text-[11px]">
                        <th className="p-2 border-r border-gray-300">Item Description</th>
                        <th className="p-2 border-r border-gray-300 text-center w-16">Qty</th>
                        <th className="p-2 text-right w-24">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.products?.map((item: any, idx: number) => {
                        const prodObj = item.product && typeof item.product === 'object' ? item.product : null;
                        const prodName = prodObj?.name || prodObj?.title || 'Product Item';
                        return (
                          <tr key={idx}>
                            <td className="p-2 border-r border-gray-300 font-medium">
                              <div className="font-bold text-black">{prodName}</div>
                              {item.variants && Object.keys(item.variants).length > 0 && (
                                <div className="text-[10px] text-gray-600 font-mono">
                                  {Object.entries(item.variants)
                                    .filter(([k]) => k !== 'variantId')
                                    .map(([k,v]) => `${k}: ${v}`)
                                    .join(' | ')}
                                </div>
                              )}
                            </td>
                            <td className="p-2 border-r border-gray-300 text-center font-bold text-black">{item.quantity}</td>
                            <td className="p-2 text-right font-bold text-black">₹{((item.priceAtPurchase || item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* PAYMENT TYPE BADGE */}
                <div className="border-t-2 border-black pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">PAYMENT STATUS</span>
                    {order.paymentStatus === 'paid' ? (
                      <div className="inline-block bg-emerald-600 text-white font-extrabold text-sm px-4 py-1.5 rounded uppercase tracking-wider">
                        PREPAID - DO NOT COLLECT CASH
                      </div>
                    ) : (
                      <div className="inline-block bg-amber-500 text-black font-extrabold text-sm px-4 py-1.5 rounded uppercase tracking-wider">
                        CASH ON DELIVERY - COLLECT ₹{order.totalAmount?.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="text-right border-l-2 border-black pl-4">
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">TOTAL PACKAGE VALUE</span>
                    <span className="text-2xl font-black text-black">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>

                {/* FOOTER DISPATCH NOTICE */}
                <div className="text-center text-[10px] text-gray-500 pt-2 border-t border-gray-200 uppercase font-semibold">
                  Lorven Golf Official Dispatch Seal. Verify package before accepting. Handover to assigned transport only.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
