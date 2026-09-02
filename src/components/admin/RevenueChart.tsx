"use client";

import React from 'react';

interface BarData {
  label: string;
  value: number;
}

export default function RevenueChart({ data }: { data: BarData[] }) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-2 h-36">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-1">
            <span className="text-[9px] font-bold text-gray-500 whitespace-nowrap">
              {d.value > 0 ? `₹${(d.value / 1000).toFixed(1)}k` : ''}
            </span>
            <div
              className="w-full rounded-t-lg bg-black transition-all duration-700 min-h-[4px]"
              style={{ height: `${Math.max((d.value / max) * 112, 4)}px` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-[9px] font-bold text-gray-400 text-center uppercase tracking-wide truncate">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
