"use client";

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Check } from 'lucide-react';

import PromotionalBlocksManager from './_components/PromotionalBlocksManager';

export default function CategorySettingsClient({ filterData }: { filterData: any }) {
  const categories = ['Clubs', 'Shoes', 'Apparel', 'Bags', 'Balls', 'Accessories'];
  const [activeTab, setActiveTab] = useState('Clubs');
  const [innerTab, setInnerTab] = useState<'filters' | 'promos'>('promos');
  
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
          if (activeTab === 'Clubs') defaults = ['Hand', 'Dexterity', 'Flex', 'Style'];
          else if (activeTab === 'Shoes') defaults = ['Size', 'Spikes', 'Width'];
          else if (activeTab === 'Apparel') defaults = ['Size', 'Color'];
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-4 font-bold text-sm uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
              activeTab === cat 
                ? 'border-black text-black bg-white' 
                : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-100/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="p-8">
        <div className="flex gap-4 mb-8">
          <button onClick={() => setInnerTab('promos')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${innerTab === 'promos' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Promotional Blocks</button>
          <button onClick={() => setInnerTab('filters')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${innerTab === 'filters' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Sidebar Filters</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div>
            {innerTab === 'filters' ? (
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-black text-black">Active Filters for {activeTab}</h2>
                    <p className="text-sm text-gray-500 mt-1">Select which attributes should appear in the sidebar.</p>
                  </div>
                  <button 
                    onClick={handleSaveFilters}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      success 
                        ? 'bg-green-600 text-white' 
                        : 'bg-black text-white hover:bg-gray-800'
                    } disabled:opacity-70`}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />)}
                    {saving ? 'Saving...' : (success ? 'Saved!' : 'Save Filters')}
                  </button>
                </div>

                {availableAttributes.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 italic">No custom attributes found for {activeTab} products yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableAttributes.map(attr => (
                      <label key={attr} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        allowedFilters.includes(attr) 
                          ? 'border-black bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <span className="font-bold text-sm uppercase tracking-wide text-gray-800">{attr}</span>
                        
                        <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${allowedFilters.includes(attr) ? 'bg-black' : 'bg-gray-200'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${allowedFilters.includes(attr) ? 'translate-x-6' : 'translate-x-1'}`}></div>
                        </div>
                        
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={allowedFilters.includes(attr)} 
                          onChange={() => handleToggle(attr)}
                        />
                      </label>
                    ))}
                  </div>
                )}
                
                <div className="mt-8 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium">
                  Note: The <strong>Brand</strong> and <strong>Category/Type</strong> filters are always displayed automatically and cannot be toggled here.
                </div>
              </div>
            ) : (
              <PromotionalBlocksManager 
                activeTab={activeTab} 
                initialSettings={settings} 
                onSave={handleSavePromos} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
