"use client";

import React, { useState, useMemo } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import RevenueChart from './RevenueChart';

interface OrderItem {
  totalAmount: number;
  createdAt: string | Date;
}

export default function RevenueTrendCard({ allOrders }: { allOrders: OrderItem[] }) {
  const [filter, setFilter] = useState<'7days' | '30days' | 'thisMonth' | 'all'>('all');

  const { chartData, totalRevenue, periodLabel } = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let title = "";

    if (filter === '7days') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      title = "Last 7 Days";
    } else if (filter === '30days') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      title = "Last 30 Days";
    } else if (filter === 'thisMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      title = "This Month";
    } else {
      // All Time
      startDate = new Date(0);
      title = "All Time Sales Activity";
    }

    if (filter === '7days') {
      // Build 7 daily slots
      const resultData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });
        const start = new Date(d); start.setHours(0, 0, 0, 0);
        const end = new Date(d); end.setHours(23, 59, 59, 999);
        
        const value = allOrders
          .filter(o => { const c = new Date(o.createdAt); return c >= start && c <= end; })
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return { label: dayLabel, value };
      });
      const periodTotal = resultData.reduce((s, d) => s + d.value, 0);
      return { chartData: resultData, totalRevenue: periodTotal, periodLabel: title };
    } 

    if (filter === '30days') {
      // Group by 6 5-day intervals or weekly buckets across 30 days
      const resultData = Array.from({ length: 6 }, (_, i) => {
        const endDays = (5 - i) * 5;
        const startDays = endDays + 4;
        const start = new Date(now); start.setDate(now.getDate() - startDays); start.setHours(0, 0, 0, 0);
        const end = new Date(now); end.setDate(now.getDate() - endDays); end.setHours(23, 59, 59, 999);
        const label = `${start.getDate()} ${start.toLocaleDateString('en-IN', { month: 'short' })}`;
        
        const value = allOrders
          .filter(o => { const c = new Date(o.createdAt); return c >= start && c <= end; })
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return { label, value };
      });
      const periodTotal = resultData.reduce((s, d) => s + d.value, 0);
      return { chartData: resultData, totalRevenue: periodTotal, periodLabel: title };
    }

    // All Time or This Month: Group by actual order date keys
    const filteredOrders = allOrders.filter(o => new Date(o.createdAt) >= startDate);
    const dateMap: Record<string, { label: string; value: number; timestamp: number }> = {};

    filteredOrders.forEach(o => {
      const d = new Date(o.createdAt);
      const dateKey = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { label, value: 0, timestamp: d.getTime() };
      }
      dateMap[dateKey].value += (o.totalAmount || 0);
    });

    const sorted = Object.values(dateMap).sort((a, b) => a.timestamp - b.timestamp);
    const resultData = sorted.length > 0 
      ? sorted.map(item => ({ label: item.label, value: item.value }))
      : [{ label: 'No Sales', value: 0 }];

    const periodTotal = filteredOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    return { chartData: resultData, totalRevenue: periodTotal, periodLabel: title };

  }, [allOrders, filter]);

  const filterOptions = [
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ] as const;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[#006747]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Revenue Trend — {periodLabel}</h2>
            <p className="text-xs text-gray-500">Includes all non-cancelled orders</p>
          </div>
        </div>

        {/* Filter Pills & Summary */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
          <div className="text-right">
            <span className="text-xs text-gray-400 font-medium">Filtered Total: </span>
            <span className="text-sm font-bold text-gray-900 block sm:inline">
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Interactive Button Pills */}
          <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/60 overflow-x-auto max-w-full">
            {filterOptions.map((opt) => {
              const isActive = filter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                    isActive 
                      ? 'bg-black text-white shadow-sm scale-[1.02]' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <RevenueChart data={chartData} />
    </div>
  );
}
