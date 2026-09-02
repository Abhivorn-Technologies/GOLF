"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';

export default function AccountReturns() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/user/orders');
        const data = await res.json();
        
        if (res.ok) {
          // Filter to only cancelled or returned orders
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
    <div className="w-full">
      <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-8">
        Returns & Cancellations
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
          <p className="font-semibold text-sm">Loading records...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center flex flex-col items-center">
          <RefreshCcw className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1.5} />
          <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tighter">No Returns or Cancellations</h3>
          <p className="font-medium text-gray-500 text-sm max-w-md">
            You do not have any cancelled orders or active return requests.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
              
              <div className="bg-gray-50 border-b border-gray-100 py-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                    Order ID
                  </span>
                  <Link href={`/account/orders/${order._id}`} className="font-bold text-black text-sm hover:underline flex items-center gap-1">
                    #{order._id.slice(-8).toUpperCase()} <span className="text-gray-400">&rarr;</span>
                  </Link>
                </div>
                
                <div className="flex flex-col gap-1.5 sm:items-end">
                   <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                    Status
                   </span>
                   {order.shippingStatus === 'cancelled' ? (
                     <span className="text-red-600 font-bold text-sm uppercase">Cancelled</span>
                   ) : (
                     <span className="text-yellow-600 font-bold text-sm uppercase">Return {order.returnStatus}</span>
                   )}
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl">
                  <span className="font-bold text-gray-700 text-xs uppercase tracking-widest">Reason Provided</span>
                  <p className="text-gray-600 text-sm">
                    {order.shippingStatus === 'cancelled' ? order.cancellationReason || 'No reason provided' : order.returnReason || 'No reason provided'}
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 mt-2">
                   {order.products?.map((item: any, idx: number) => {
                      const prodName = item.product?.name || item.product?.title || 'Unknown Product';
                      const prodImage = item.product?.image || (item.product?.images && item.product.images[0]) || '/placeholder.png';
                      
                      return (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-200">
                          <img src={prodImage.startsWith('http') ? prodImage : `/images/${prodImage}`} alt={prodName} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-black font-bold text-sm">{prodName}</span>
                          <span className="text-gray-500 text-xs font-medium">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    )})}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
