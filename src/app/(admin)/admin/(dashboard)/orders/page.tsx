"use client";

import React, { useEffect, useState } from 'react';
import { Search, Eye, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ClientPagination from '@/components/admin/ClientPagination';

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

  const fetchOrders = async (p = page, q = searchQuery, status = statusFilter) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders?page=${p}&limit=10&search=${encodeURIComponent(q)}&status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalPages(Math.ceil((data.totalCount || 0) / 10));
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
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
      if (res.ok) fetchOrders();
    } catch (e) {
      console.error(e);
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

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track customer orders.</p>
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
                <th className="py-5 px-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 font-medium">
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
                        {order.trackingId && (
                          <div className="text-[10px] text-gray-400 mt-2 font-medium">
                            <span className="font-bold text-gray-600">{order.courierName}</span><br/>
                            ID: {order.trackingId}
                          </div>
                        )}
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
                      <Link 
                        href={`/admin/orders/${order._id}`}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
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
      </div>
    </div>
  );
}
