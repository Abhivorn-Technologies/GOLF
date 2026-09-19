"use client";

import React, { useState } from 'react';
import { UploadCloud, X, Plus, Trash2, Save, Loader2, Check } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

function resolveImgSrc(src?: string) {
  if (!src || typeof src !== 'string' || src.trim() === '' || src === '/placeholder.png' || src === 'placeholder.png' || src === 'null' || src === 'undefined') {
    return '/images/golf.png';
  }
  const clean = src.trim();
  if (clean.startsWith('data:') || clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
    return clean;
  }
  return `/images/${clean}`;
}

export default function PromotionalBlocksManager({ 
  activeTab, 
  initialSettings,
  onSave
}: { 
  activeTab: string;
  initialSettings: any;
  onSave: (data: any) => Promise<void>;
}) {
  const [shopByCategory, setShopByCategory] = useState<any[]>(initialSettings?.shopByCategory || []);
  const [bestBrands, setBestBrands] = useState<any[]>(initialSettings?.bestBrands || []);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    setShopByCategory(initialSettings?.shopByCategory || []);
    setBestBrands(initialSettings?.bestBrands || []);
  }, [initialSettings]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const updateItemImage = async (type: 'cat' | 'brand', index: number, file: File) => {
    try {
      const url = await handleImageUpload(file);
      if (type === 'cat') {
        const newArr = [...shopByCategory];
        newArr[index].image = url;
        setShopByCategory(newArr);
      } else {
        const newArr = [...bestBrands];
        newArr[index].image = url;
        setBestBrands(newArr);
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await onSave({ shopByCategory, bestBrands });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <div>
          <h2 className="text-xl font-black text-black">Promotional UI Settings for {activeTab}</h2>
          <p className="text-sm text-gray-500 mt-1">Configure the large visual blocks that appear on the {activeTab} storefront.</p>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            success 
              ? 'bg-green-600 text-white' 
              : 'bg-black text-white hover:bg-gray-800'
          } disabled:opacity-70`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />)}
          {saving ? 'Saving...' : (success ? 'Saved!' : 'Save UI Settings')}
        </button>
      </div>

      {/* Shop By Category Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Shop by Category Blocks</h3>
          <button 
            onClick={() => setShopByCategory([...shopByCategory, { id: Date.now().toString(), name: '', desc: '', href: '', image: '' }])}
            className="flex items-center gap-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Block
          </button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {shopByCategory.map((item, idx) => (
            <div key={item.id} className="p-6 border border-gray-200 rounded-2xl flex gap-6 bg-white relative group">
              <button onClick={() => setShopByCategory(shopByCategory.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="w-[140px] h-[180px] shrink-0 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group/img">
                {item.image ? (
                  <>
                    <img 
                      src={resolveImgSrc(item.image)} 
                      alt="Preview" 
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/golf.png'; }}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full">
                        Change
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && updateItemImage('cat', idx, e.target.files[0])} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer text-center p-4">
                    <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <span className="text-xs text-gray-500">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && updateItemImage('cat', idx, e.target.files[0])} />
                  </label>
                )}
              </div>
              <div className="flex-1 space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                  <input value={item.name} onChange={e => { const n = [...shopByCategory]; n[idx].name = e.target.value; setShopByCategory(n); }} className="w-full border-b border-gray-200 focus:border-black outline-none py-1 font-medium" placeholder="e.g. DRIVERS" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                  <input value={item.desc} onChange={e => { const n = [...shopByCategory]; n[idx].desc = e.target.value; setShopByCategory(n); }} className="w-full border-b border-gray-200 focus:border-black outline-none py-1 text-sm" placeholder="e.g. Maximum distance" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Link / URL</label>
                  <input value={item.href} onChange={e => { const n = [...shopByCategory]; n[idx].href = e.target.value; setShopByCategory(n); }} className="w-full border-b border-gray-200 focus:border-black outline-none py-1 text-sm text-blue-600" placeholder="e.g. /category/clubs?type=Drivers" />
                </div>
              </div>
            </div>
          ))}
          {shopByCategory.length === 0 && (
            <div className="col-span-2 text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No category blocks configured yet.</p>
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Best Brands Carousel Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Best Brands Carousel</h3>
          <button 
            onClick={() => setBestBrands([...bestBrands, { id: Date.now().toString(), name: '', link: 'Shop Now', image: '' }])}
            className="flex items-center gap-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Brand Banner
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestBrands.map((item, idx) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-2xl flex flex-col gap-4 bg-white relative group">
              <button onClick={() => setBestBrands(bestBrands.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-white bg-black/50 hover:bg-red-500 rounded-full p-1 z-10 transition-colors opacity-0 group-hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-full aspect-[3/4] bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group/img">
                {item.image ? (
                  <>
                    <img 
                      src={resolveImgSrc(item.image)} 
                      alt="Preview" 
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/golf.png'; }}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Change
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && updateItemImage('brand', idx, e.target.files[0])} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer text-center p-4 w-full h-full flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
                    <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <span className="text-xs text-gray-500">Portrait Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && updateItemImage('brand', idx, e.target.files[0])} />
                  </label>
                )}
              </div>
              <div className="space-y-3">
                <input value={item.name} onChange={e => { const n = [...bestBrands]; n[idx].name = e.target.value; setBestBrands(n); }} className="w-full border-b border-gray-200 focus:border-black outline-none py-1 text-sm font-bold text-center uppercase" placeholder="Brand Name" />
                <input value={item.link} onChange={e => { const n = [...bestBrands]; n[idx].link = e.target.value; setBestBrands(n); }} className="w-full border-b border-gray-200 focus:border-black outline-none py-1 text-xs text-center text-gray-500 uppercase" placeholder="Link Text" />
              </div>
            </div>
          ))}
          {bestBrands.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No brands configured for this carousel yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
