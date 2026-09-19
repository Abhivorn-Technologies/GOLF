"use client";

import React, { useEffect, useState } from 'react';
import { Search, Eye, CheckSquare, Loader2, Printer, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ClientPagination from '@/components/admin/ClientPagination';
import Barcode from '@/components/admin/Barcode';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('shipped');
  const [bulkUpdating, setBulkUpdating] = useState(false);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Printing modal state
  const [selectedPrintOrder, setSelectedPrintOrder] = useState<any | null>(null);

  const fetchOrders = async (p = page, q = searchQuery, status = statusFilter) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders?page=${p}&limit=10&search=${encodeURIComponent(q)}&status=${status}`);
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalPages(Math.ceil((data.totalCount || 0) / 10));
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders(page, searchQuery, statusFilter);
    }, 300);
    return () => clearTimeout(handler);
  }, [page, searchQuery, statusFilter]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingStatus: newStatus })
      });
      if (res.ok) {
        toast.success("Order status updated");
        fetchOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error updating order status");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o._id)));
    }
  };

  const bulkUpdate = async () => {
    if (selectedIds.size === 0) return;
    setBulkUpdating(true);
    try {
      await Promise.all([...selectedIds].map(id =>
        fetch(`/api/admin/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shippingStatus: bulkStatus })
        })
      ));
      toast.success(`${selectedIds.size} orders updated to ${bulkStatus}`);
      setSelectedIds(new Set());
      fetchOrders();
    } catch { toast.error('Bulk update failed'); }
    finally { setBulkUpdating(false); }
  };

  const filteredOrders = orders; // Filtering is now handled on the server

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 mt-1">Manage, track, and print package shipping labels for all customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex gap-4 bg-white items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search orders by ID or customer..." 
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50/50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all text-sm outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {selectedIds.size > 0 && (
          <div className="px-6 py-3 bg-black text-white flex items-center gap-4">
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm font-bold">{selectedIds.size} selected</span>
            <div className="flex items-center gap-2 ml-auto">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="text-sm bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white outline-none"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={bulkUpdate}
                disabled={bulkUpdating}
                className="text-sm font-bold bg-white text-black px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {bulkUpdating ? 'Updating...' : 'Apply'}
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="text-sm text-white/60 hover:text-white">
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-50 text-xs uppercase tracking-wider text-gray-400 bg-white font-semibold">
                <th className="py-5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && selectedIds.size === filteredOrders.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-black cursor-pointer"
                  />
                </th>
                <th className="py-5 px-8">Order ID</th>
                <th className="py-5 px-8">Date</th>
                <th className="py-5 px-8">Customer</th>
                <th className="py-5 px-8">Total</th>
                <th className="py-5 px-8">Status</th>
                <th className="py-5 px-8 text-right">Update Status</th>
                <th className="py-5 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-black" />
                      <span className="text-xs">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400 font-medium">
                    {orders.length === 0 ? 'No orders have been placed yet.' : 'No orders match your search.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className={`border-b border-gray-50/50 hover:bg-gray-50/30 transition-colors group ${selectedIds.has(order._id) ? 'bg-blue-50/40' : ''}`}>
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(order._id)}
                        onChange={() => toggleSelect(order._id)}
                        className="w-4 h-4 rounded accent-black cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-8 font-bold text-gray-900">
                      <Link href={`/admin/orders/${order._id}`} className="hover:underline hover:text-black transition-colors text-gray-500">
                        #{order._id.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-4 px-8 text-gray-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-8">
                      <div className="font-bold text-gray-900">{order.shippingAddress?.name || 'Guest'}</div>
                      <div className="text-gray-400 text-xs mt-1">{order.customerEmail}</div>
                    </td>
                    <td className="py-4 px-8 font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="py-4 px-8">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border ${getStatusColor(order.shippingStatus)}`}>
                          {order.shippingStatus?.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-8 text-right">
                      <select 
                        value={order.shippingStatus} 
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none focus:border-black font-medium text-gray-700"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedPrintOrder(order)}
                          title="Print Package Shipping Label"
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-all cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <Link 
                          href={`/admin/orders/${order._id}`}
                          title="View Order Details"
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <ClientPagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={(p) => setPage(p)} 
        />
      </div>      {/* PRINT SHIPPING LABEL MODAL FOR ANY ORDER */}
      {selectedPrintOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Sticky Top Control Header (Hidden when printing) */}
            <div className="bg-gray-900 text-white p-4 px-6 flex items-center justify-between shrink-0 sticky top-0 z-50 border-b border-gray-800 print:hidden">
              <span className="text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" /> Lorven Golf Package Shipping Slip
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-extrabold uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  title="Save as PDF or Print on Label Printer"
                >
                  <Printer className="w-4 h-4" /> Download PDF / Print
                </button>

                <button 
                  onClick={() => setSelectedPrintOrder(null)} 
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
                    <div className="text-xl font-mono font-black text-black">#{selectedPrintOrder._id.slice(-8).toUpperCase()}</div>
                    <div className="text-[11px] text-gray-600">Date: {new Date(selectedPrintOrder.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* SCANNABLE CODE128 BARCODE */}
                <div className="bg-white p-2 rounded-lg border border-gray-300 text-center flex flex-col items-center justify-center">
                  <Barcode value={selectedPrintOrder._id.toUpperCase()} height={50} fontSize={13} />
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
                    <p className="font-extrabold text-sm uppercase text-black">{selectedPrintOrder.shippingAddress?.name}</p>
                    <p className="text-xs font-medium text-black">
                      {selectedPrintOrder.shippingAddress?.houseNumber ? `${selectedPrintOrder.shippingAddress.houseNumber}, ` : ''}{selectedPrintOrder.shippingAddress?.street}
                    </p>
                    {selectedPrintOrder.shippingAddress?.area && <p className="text-xs text-gray-700">{selectedPrintOrder.shippingAddress.area}</p>}
                    {selectedPrintOrder.shippingAddress?.landmark && <p className="text-xs text-gray-700">Landmark: {selectedPrintOrder.shippingAddress.landmark}</p>}
                    <p className="text-xs font-bold text-black uppercase">
                      {selectedPrintOrder.shippingAddress?.city}, {selectedPrintOrder.shippingAddress?.state} - {selectedPrintOrder.shippingAddress?.zip}
                    </p>
                    <p className="text-xs font-extrabold text-black pt-1">
                      📞 CONTACT: {selectedPrintOrder.shippingAddress?.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* COURIER & LOGISTICS DETAILS */}
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">LOGISTICS / TRANSPORT</span>
                    <span className="font-extrabold text-black text-sm">{selectedPrintOrder.courierName || 'In-House Logistics'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">AWB / TRACKING ID</span>
                    <span className="font-mono font-extrabold text-black text-sm">{selectedPrintOrder.trackingId || `LOG-${selectedPrintOrder._id.slice(-6).toUpperCase()}`}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">DELIVERY AGENT</span>
                    <span className="font-bold text-black">{selectedPrintOrder.deliveryAgentName || 'Assigned Agent'}</span>
                    {selectedPrintOrder.deliveryAgentPhone && <div className="text-[11px] font-semibold text-gray-700">{selectedPrintOrder.deliveryAgentPhone}</div>}
                  </div>
                </div>

                {/* PACKAGE CONTENTS TABLE */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700">PACKAGE CONTENT LIST ({selectedPrintOrder.products?.length || 1} ITEM(S)):</span>
                  <table className="w-full text-left border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-gray-200 border-b border-gray-300 uppercase font-bold text-[11px]">
                        <th className="p-2 border-r border-gray-300">Item Description</th>
                        <th className="p-2 border-r border-gray-300 text-center w-16">Qty</th>
                        <th className="p-2 text-right w-24">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedPrintOrder.products?.map((item: any, idx: number) => {
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
                    {selectedPrintOrder.paymentStatus === 'paid' ? (
                      <div className="inline-block bg-emerald-600 text-white font-extrabold text-sm px-4 py-1.5 rounded uppercase tracking-wider">
                        PREPAID - DO NOT COLLECT CASH
                      </div>
                    ) : (
                      <div className="inline-block bg-amber-500 text-black font-extrabold text-sm px-4 py-1.5 rounded uppercase tracking-wider">
                        CASH ON DELIVERY - COLLECT ₹{selectedPrintOrder.totalAmount?.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="text-right border-l-2 border-black pl-4">
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">TOTAL PACKAGE VALUE</span>
                    <span className="text-2xl font-black text-black">₹{selectedPrintOrder.totalAmount?.toLocaleString()}</span>
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
