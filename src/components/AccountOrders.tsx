"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PackageOpen } from 'lucide-react';

export default function AccountOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/user/orders');
        const data = await res.json();
        
        if (res.ok) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch user orders", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-8">
        My Orders
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
          <p className="font-semibold text-sm">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-16 text-center flex flex-col items-center">
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
              <div className="bg-gray-50 border-b border-gray-100 py-4 px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex flex-wrap gap-8 sm:gap-12">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                      Order Placed
                    </span>
                    <span className="font-semibold text-black text-sm">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                      Total Amount
                    </span>
                    <span className="font-semibold text-black text-sm">
                      ₹{order.totalAmount?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                      Ship To
                    </span>
                    <span className="font-semibold text-black text-sm hover:underline cursor-pointer">
                      {order.shippingAddress?.name || 'Customer'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:items-end w-full sm:w-auto">
                  <span className="font-bold text-gray-500 text-[10px] uppercase tracking-widest">
                    Order ID
                  </span>
                  <Link href={`/account/orders/${order._id}`} className="font-bold text-black text-sm hover:underline flex items-center gap-1">
                    #{order._id.slice(-8).toUpperCase()} <span className="text-gray-400">&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-start justify-between">
                
                <div className="flex flex-col gap-6 flex-1 w-full">
                  <div className="inline-block self-start px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {order.shippingStatus || 'Processing'}
                  </div>

                  <div className="flex flex-col gap-6 w-full">
                    {order.products?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-6 items-center">
                        <Link href={`/product/${item.product._id}`} className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-3 shrink-0 border border-gray-100 hover:border-black transition-colors">
                          <img src={item.product?.image?.startsWith('http') ? item.product.image : `/images/${item.product?.image}`} alt={item.product?.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </Link>
                        
                        <div className="flex flex-col gap-1.5 flex-1">
                          <Link href={`/product/${item.product?._id}`} className="text-black text-lg font-black tracking-tight leading-tight hover:underline hover:text-green-800">
                            {item.product?.name}
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
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0 lg:min-w-[220px]">
                  <button className="w-full bg-black text-white rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md text-center">
                    Track Package
                  </button>
                  <button className="w-full bg-white border border-gray-200 text-black rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors text-center">
                    Return Items
                  </button>
                  <button className="w-full bg-white border border-gray-200 text-black rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors text-center">
                    Seller Feedback
                  </button>
                </div>

              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
