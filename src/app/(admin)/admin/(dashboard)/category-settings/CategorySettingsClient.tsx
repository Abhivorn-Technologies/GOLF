"use client";

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Check, Filter } from 'lucide-react';
import PromotionalBlocksManager from './_components/PromotionalBlocksManager';

export default function CategorySettingsClient({ filterData }: { filterData: any }) {
  const categories = ['Clubs', 'Shoes', 'Apparel', 'Bags', 'Balls', 'Accessories'];
  const [activeTab, setActiveTab] = useState('Clubs');
  
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [allowedFilters, setAllowedFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/settings?page=${activeTab.toLowerCase()}`);
        const data = await res.json();
        setSettings(data);
        
        if (data.allowedFilters && data.allowedFilters.length > 0) {
          setAllowedFilters(data.allowedFilters);
        } else {
          let defaults: string[] = [];
          if (activeTab === 'Clubs') defaults = ['Hand', 'Dexterity', 'Flex', 'Style', 'Gender'];
          else if (activeTab === 'Shoes') defaults = ['Size', 'Spikes', 'Width', 'Gender'];
          else if (activeTab === 'Apparel') defaults = ['Size', 'Color', 'Gender'];
          else if (activeTab === 'Bags') defaults = ['Type', 'Top', 'Dividers'];
          else if (activeTab === 'Balls') defaults = ['Compression', 'Feel', 'Construction'];
          else if (activeTab === 'Accessories') defaults = ['Type'];
          setAllowedFilters(defaults);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [activeTab]);

  const handleToggle = (attrName: string) => {
    setAllowedFilters(prev => 
      prev.includes(attrName) 
        ? prev.filter(a => a !== attrName)
        : [...prev, attrName]
    );
  };

  const handleSaveFilters = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: activeTab.toLowerCase(),
          allowedFilters: allowedFilters
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePromos = async (promoData: any) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: activeTab.toLowerCase(),
          ...promoData
        })
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      setSettings(updated);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const categoryData = filterData[activeTab];
  const availableAttributes = categoryData?.attributes ? Object.keys(categoryData.attributes) : [];

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex flex-wrap gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-3 font-bold text-sm uppercase tracking-widest rounded-full transition-all duration-300 ${
              activeTab === cat 
                ? 'bg-black text-white shadow-lg scale-105' 
                : 'bg-white text-gray-500 border border-gray-200 hover:border-black hover:text-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-2">
                  <Filter className="w-6 h-6" /> Sidebar Filters: {activeTab}
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
                  Toggle the switches to choose exactly which attributes appear in the storefront sidebar for the <strong className="text-black">{activeTab}</strong> category.
                </p>
              </div>
              <button 
                onClick={handleSaveFilters}
                disabled={saving}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                  success 
                    ? 'bg-green-500 text-white shadow-[0_4px_14px_rgba(34,197,94,0.3)]' 
                    : 'bg-black text-white hover:bg-gray-800 shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)]'
                } disabled:opacity-70`}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />)}
                {saving ? 'Saving...' : (success ? 'Saved!' : 'Save Changes')}
              </button>
            </div>

            {availableAttributes.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No custom attributes have been added to any {activeTab} products yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {availableAttributes.map(attr => {
                  const isActive = allowedFilters.includes(attr);
                  return (
                    <label key={attr} className={`relative flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden ${
                      isActive 
                        ? 'border-black bg-black/5 shadow-md' 
                        : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}>
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black rounded-l-2xl"></div>}
                      <span className={`font-black text-sm uppercase tracking-wider z-10 transition-colors ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>
                        {attr}
                      </span>
                      
                      <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center z-10 ${isActive ? 'bg-black' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute shadow-sm transition-transform duration-300 ease-in-out ${isActive ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                      </div>
                      
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isActive} 
                        onChange={() => handleToggle(attr)}
                      />
                    </label>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-8 font-medium">
              Note: Core attributes like <strong className="text-gray-700">Brand</strong> and <strong className="text-gray-700">Category/Type</strong> are hardcoded to always display and cannot be turned off here.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
            <h2 className="text-2xl font-black text-black tracking-tight mb-2">Promotional Blocks</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xl leading-relaxed">
              Manage the category banners, featured brands, and specific promotional links that appear at the top of the <strong className="text-black">{activeTab}</strong> page.
            </p>
            <div className="pt-2">
              <PromotionalBlocksManager activeTab={activeTab} initialSettings={settings} onSave={handleSavePromos} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
