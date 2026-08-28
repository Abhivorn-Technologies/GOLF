import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function SidebarFilter() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white pr-8 hidden lg:block">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold uppercase tracking-tight text-zinc-900">Filters</h3>
      </div>
      <div className="w-full h-px bg-gray-200 mb-6"></div>
      
      {/* Style Filter */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 cursor-pointer">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Style</h4>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-green-500 transition-colors"></div>
            <span className="text-sm text-zinc-700 font-medium group-hover:text-zinc-900">Spiked</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-green-500 transition-colors"></div>
            <span className="text-sm text-zinc-700 font-medium group-hover:text-zinc-900">Spikeless</span>
          </label>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200 mb-6"></div>

      {/* Gender Filter */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 cursor-pointer">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Gender</h4>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-green-500 transition-colors"></div>
            <span className="text-sm text-zinc-700 font-medium group-hover:text-zinc-900">Men's (1206)</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-green-500 transition-colors"></div>
            <span className="text-sm text-zinc-700 font-medium group-hover:text-zinc-900">Women's (450)</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
