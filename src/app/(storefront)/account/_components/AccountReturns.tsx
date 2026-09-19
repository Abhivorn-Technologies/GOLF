"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCcw, AlertTriangle, ArrowRight, ChevronRight } from 'lucide-react';

function resolveImg(src?: string) {
  if (!src || src === '/placeholder.png' || src === 'placeholder.png' || src === 'undefined' || src === 'null') return '/images/golf.png';
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) return src;
  return `/images/${src}`;
}

export default function AccountReturns() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/user/orders');
        const data = await res.json();
        
        if (res.ok) {
          const returnsAndCancellations = (data.orders || []).filter((o: any) => 
            o.shippingStatus === 'cancelled' || 
            (o.returnStatus && o.returnStatus !== 'none')
          );
          setOrders(returnsAndCancellations);
        }
      } catch (error) {
        console.error("Failed to fetch return orders", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="w-full font-sans space-y-6">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Returns & Cancellations</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Track your active return requests and cancelled orders</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 text-sm font-medium">Loading return records...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
            <RefreshCcw className="w-8 h-8 text-zinc-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">No Returns or Cancellations</h3>
          <p className="text-zinc-500 text-sm max-w-sm">
            You do not have any active return requests or cancelled orders.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              
              <div className="bg-zinc-50/70 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-500">Order ID:</span>
                  <Link href={`/account/orders/${order._id}`} className="font-bold text-zinc-900 text-xs hover:underline flex items-center gap-1">
                    #{order._id.slice(-8).toUpperCase()} <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  </Link>
                </div>
                
                <div>
                  {order.shippingStatus === 'cancelled' ? (
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Cancelled
                    </span>
                  ) : order.returnStatus === 'approved' ? (
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Approved - Refund Processing
                    </span>
                  ) : order.returnStatus === 'refunded' ? (
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Refunded
                    </span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Return Requested
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Reason Provided</span>
                  <p className="text-sm font-medium text-zinc-700">
                    {order.shippingStatus === 'cancelled' ? order.cancellationReason || 'No reason provided' : order.returnReason || 'No reason provided'}
                  </p>
                </div>
                
                {order.returnStatus === 'approved' ? (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex flex-col gap-1 text-xs text-blue-900 font-medium">
                    <div className="flex items-center justify-between font-bold text-blue-950">
                      <span>Return Status:</span>
                      <span>✅ Approved - Refund Processing</span>
                    </div>
                    <p className="text-[11px] text-blue-800 mt-0.5">Please ship the item back to our warehouse. Your refund will be finalized upon product inspection.</p>
                  </div>
                ) : Number(order.refundAmount) > 0 ? (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Refund Issued</span>
                    <span className="text-sm font-black text-emerald-900">₹{Number(order.refundAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                ) : order.paymentStatus === 'paid' ? (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs font-bold text-amber-800">
                    <span>Refund Status</span>
                    <span>⏳ Pending Admin Approval</span>
                  </div>
                ) : null}
                <div className="space-y-3 pt-2">
                  {order.products?.map((item: any, idx: number) => {
                    const prodObj = item.product && typeof item.product === 'object' ? item.product : null;
                    const prodName = prodObj?.name || prodObj?.title || item.name || item.title || 'Golf Equipment';
                    const rawImage = prodObj?.image || (Array.isArray(prodObj?.images) ? prodObj.images[0] : null) || item.image || (Array.isArray(item.images) ? item.images[0] : null);
                    
                    return (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-zinc-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100 overflow-hidden">
                          <img 
                            src={resolveImg(rawImage)} 
                            alt={prodName} 
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/golf.png'; }}
                            className="w-full h-full object-contain mix-blend-multiply" 
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-sm">{prodName}</h4>
                          <span className="text-xs text-zinc-500 font-medium">Quantity: {item.quantity}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
