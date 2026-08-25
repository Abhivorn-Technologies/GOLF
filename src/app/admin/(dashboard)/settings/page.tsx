"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function PageSettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState('clubs'); // Allow future expansion to other pages
  
  const [bestBrands, setBestBrands] = useState<any[]>([]);
  const [shopByCategory, setShopByCategory] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/settings?page=${page}`);
        if (res.ok) {
          const data = await res.json();
          setBestBrands(data.bestBrands || []);
          setShopByCategory(data.shopByCategory || []);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
      setLoading(false);
    };
    fetchSettings();
  }, [page]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          bestBrands,
          shopByCategory
        })
      });
      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings");
      }
    } catch (e) {
      alert("Error saving settings");
    }
    setSaving(false);
  };

  const addBrand = () => setBestBrands([...bestBrands, { id: Date.now().toString(), name: '', link: 'Shop Now', color: 'from-gray-100 to-gray-200' }]);
  const removeBrand = (idx: number) => setBestBrands(bestBrands.filter((_, i) => i !== idx));
  const updateBrand = (idx: number, field: string, value: string) => {
    const newBrands = [...bestBrands];
    newBrands[idx][field] = value;
    setBestBrands(newBrands);
  };

  const addCategory = () => setShopByCategory([...shopByCategory, { id: Date.now().toString(), name: '', desc: '', href: '', color: 'from-gray-100 to-gray-200' }]);
  const removeCategory = (idx: number) => setShopByCategory(shopByCategory.filter((_, i) => i !== idx));
  const updateCategory = (idx: number, field: string, value: string) => {
    const newCats = [...shopByCategory];
    newCats[idx][field] = value;
    setShopByCategory(newCats);
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotional Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage static promotional sections across category pages.</p>
        </div>
        <div className="flex gap-4 items-center">
          <select value={page} onChange={(e) => setPage(e.target.value)} className="border-gray-200 rounded-lg text-sm font-medium">
            <option value="clubs">Clubs Page</option>
            <option value="apparel">Apparel Page</option>
            {/* Add more pages later */}
          </select>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 bg-[#006747] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#00573b] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Best Brands Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Best Brands Carousel</h2>
            <button onClick={addBrand} className="flex items-center gap-1 text-sm text-[#006747] font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add Brand
            </button>
          </div>
          
          <div className="space-y-4">
            {bestBrands.map((brand, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Brand Name</label>
                    <input type="text" value={brand.name} onChange={(e) => updateBrand(idx, 'name', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. SM 11 Wedge" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Link Text</label>
                    <input type="text" value={brand.link} onChange={(e) => updateBrand(idx, 'link', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. Shop Now" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gradient Classes (Tailwind)</label>
                    <input type="text" value={brand.color} onChange={(e) => updateBrand(idx, 'color', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. from-gray-100 to-gray-200" />
                  </div>
                </div>
                <button onClick={() => removeBrand(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors mt-6">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {bestBrands.length === 0 && <p className="text-sm text-gray-500 italic">No best brands configured.</p>}
          </div>
        </div>

        {/* Shop By Category Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Shop By Category Cards</h2>
            <button onClick={addCategory} className="flex items-center gap-1 text-sm text-[#006747] font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
          
          <div className="space-y-4">
            {shopByCategory.map((cat, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category Title</label>
                    <input type="text" value={cat.name} onChange={(e) => updateCategory(idx, 'name', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. DRIVERS" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <input type="text" value={cat.desc} onChange={(e) => updateCategory(idx, 'desc', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. Maximum distance Unmatched power" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">URL Link</label>
                    <input type="text" value={cat.href} onChange={(e) => updateCategory(idx, 'href', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. /category/clubs?type=Drivers" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gradient Classes (Tailwind)</label>
                    <input type="text" value={cat.color} onChange={(e) => updateCategory(idx, 'color', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. from-blue-500/20 to-blue-900/40" />
                  </div>
                </div>
                <button onClick={() => removeCategory(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors mt-6">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {shopByCategory.length === 0 && <p className="text-sm text-gray-500 italic">No categories configured.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
