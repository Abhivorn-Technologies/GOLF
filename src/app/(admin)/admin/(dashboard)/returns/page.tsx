"use client";

import React, { useEffect, useState } from 'react';
import { Search, Eye, Filter, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import ClientPagination from '@/components/admin/ClientPagination';

export default function ReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReturns = async (p = page, q = searchQuery, status = statusFilter) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/returns?page=${p}&limit=10&search=${encodeURIComponent(q)}&status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setReturns(data.returns || []);
        setTotalPages(Math.ceil((data.totalCount || 0) / 10));
      }
    } catch (error) {
      console.error("Failed to fetch returns", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchReturns(page, searchQuery, statusFilter);
    }, 300);
    return () => clearTimeout(handler);
  }, [page, searchQuery, statusFilter]);

  const updateStatus = async (orderId: string, newReturnStatus: string, currentShippingStatus: string) => {
    try {
      const body: any = { orderId, returnStatus: newReturnStatus };
      // If approving a return, we might want to also ensure shippingStatus is handled, but let's stick to returnStatus for now
      
      const res = await fetch(`/api/admin/returns`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        fetchReturns();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'refunded':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'requested':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading returns...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <RotateCcw className="w-8 h-8 text-gray-400" />
            Returns & Cancellations
          </h1>
          <p className="text-gray-500 mt-1">Manage customer return requests and cancelled orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex gap-4 bg-white items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
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
            <option value="all">All Returns</option>
            <option value="requested">Requested</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-50 text-xs uppercase tracking-wider text-gray-400 bg-white font-semibold">
                <th className="py-5 px-8">Order ID</th>
                <th className="py-5 px-8">Customer</th>
                <th className="py-5 px-8">Type</th>
                <th className="py-5 px-8">Reason</th>
                <th className="py-5 px-8">Status</th>
                <th className="py-5 px-8 text-right">Update Return</th>
                <th className="py-5 px-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 font-medium">
                    No returns or cancellations found.
                  </td>
                </tr>
              ) : (
                returns.map((order) => {
                  const isCancelled = order.shippingStatus === 'cancelled';
                  const displayStatus = isCancelled ? 'cancelled' : (order.returnStatus || 'requested');
                  const reason = isCancelled ? order.cancellationReason : order.returnReason;
                  
                  return (
                    <tr key={order._id} className="border-b border-gray-50/50 hover:bg-gray-50/30 transition-colors group">
                      <td className="py-4 px-8 font-bold text-gray-900">
                        <Link href={`/admin/orders/${order._id}`} className="hover:underline hover:text-black transition-colors text-gray-500">
                          #{order._id.slice(-6).toUpperCase()}
                        </Link>
                        <div className="text-[10px] text-gray-400 font-normal mt-1">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-8">
                        <div className="font-bold text-gray-900">{order.shippingAddress?.name || 'Guest'}</div>
                        <div className="text-gray-400 text-xs mt-1">{order.customerEmail}</div>
                      </td>
                      <td className="py-4 px-8">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${isCancelled ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                          {isCancelled ? 'Cancellation' : 'Return'}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-gray-600 max-w-[200px] truncate" title={reason || 'No reason provided'}>
                        {reason || <span className="text-gray-400 italic">No reason provided</span>}
                      </td>
                      <td className="py-4 px-8">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border ${getStatusColor(displayStatus)}`}>
                          {displayStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-right">
                        {!isCancelled ? (
                          <select 
                            value={order.returnStatus || 'requested'} 
                            onChange={(e) => updateStatus(order._id, e.target.value, order.shippingStatus)}
                            className="text-xs border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 outline-none focus:border-black font-medium text-gray-700"
                          >
                            <option value="requested">Requested</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Cancelled Order</span>
                        )}
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
                  );
                })
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
