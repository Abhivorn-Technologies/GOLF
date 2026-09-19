"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, UploadCloud, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

export default function PageSettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState('clubs'); // Allow future expansion to other pages
  
  const [bestBrands, setBestBrands] = useState<any[]>([]);
  const [shopByCategory, setShopByCategory] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [utilityBar, setUtilityBar] = useState<{announcements: string[]}>({ announcements: [] });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Accordion state
  const [openSections, setOpenSections] = useState({
    bestBrands: true,
    shopByCategory: false,
    subCategories: false,
    utilityBar: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/settings?page=${page}`);
        if (res.ok) {
          const data = await res.json();
          setBestBrands(data.bestBrands || []);
          setShopByCategory(data.shopByCategory || []);
          setSubCategories(data.subCategories || []);
          setUtilityBar(data.utilityBar || { announcements: [] });
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
        credentials: 'same-origin',
        body: JSON.stringify({
          page,
          bestBrands,
          shopByCategory,
          subCategories,
          utilityBar
        })
      });
      if (res.ok) {
        showToast("Settings saved successfully!", 'success');
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast("Failed to save settings: " + (errData.error || res.statusText), 'error');
      }
    } catch (e) {
      showToast("Error saving settings", 'error');
    }
    setSaving(false);
  };

  const addBrand = () => {
    setOpenSections(prev => ({ ...prev, bestBrands: true }));
    setBestBrands([...bestBrands, { id: Date.now().toString(), name: '', link: 'Shop Now', color: 'from-gray-100 to-gray-200', image: '' }]);
  };
  const removeBrand = (idx: number) => setBestBrands(bestBrands.filter((_, i) => i !== idx));
  const updateBrand = (idx: number, field: string, value: string) => {
    const newBrands = [...bestBrands];
    newBrands[idx][field] = value;
    setBestBrands(newBrands);
  };

  const addCategory = () => {
    setOpenSections(prev => ({ ...prev, shopByCategory: true }));
    setShopByCategory([...shopByCategory, { id: Date.now().toString(), name: '', desc: '', href: '', color: 'from-gray-100 to-gray-200', image: '', icon: '' }]);
  };
  const removeCategory = (idx: number) => setShopByCategory(shopByCategory.filter((_, i) => i !== idx));
  const updateCategory = (idx: number, field: string, value: string) => {
    const newCats = [...shopByCategory];
    newCats[idx][field] = value;
    setShopByCategory(newCats);
  };

  const addSubCategory = () => {
    setOpenSections(prev => ({ ...prev, subCategories: true }));
    setSubCategories([...subCategories, { id: Date.now().toString(), name: '', image: '' }]);
  };
  const removeSubCategory = (idx: number) => setSubCategories(subCategories.filter((_, i) => i !== idx));
  const updateSubCategory = (idx: number, field: string, value: string) => {
    const newSubCats = [...subCategories];
    newSubCats[idx][field] = value;
    setSubCategories(newSubCats);
  };

  const addAnnouncement = () => {
    setUtilityBar(prev => ({ announcements: [...(prev.announcements || []), ''] }));
  };
  const removeAnnouncement = (idx: number) => {
    setUtilityBar(prev => ({ announcements: (prev.announcements || []).filter((_, i) => i !== idx) }));
  };
  const updateAnnouncement = (idx: number, value: string) => {
    setUtilityBar(prev => {
      const newAnnouncements = [...(prev.announcements || [])];
      newAnnouncements[idx] = value;
      return { announcements: newAnnouncements };
    });
  };


  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotional Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage static promotional sections across category pages.</p>
        </div>
        <div className="flex gap-4 items-center">
          <select value={page} onChange={(e) => setPage(e.target.value)} className="border-gray-200 rounded-lg text-sm font-medium">
            <option value="global">Global Settings (Utility Bar)</option>
            <option value="clubs">Clubs Page</option>
            <option value="apparel">Apparel Page</option>
            <option value="shoes">Shoes Page</option>
            <option value="bags">Bags Page</option>
            <option value="balls">Balls Page</option>
            <option value="accessories">Accessories Page</option>
          </select>
          <button 
            onClick={handleSave} 
            disabled={saving || uploadingImage}
            className="flex items-center gap-2 bg-[#006747] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#00573b] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {page === 'global' ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2 cursor-pointer select-none" onClick={() => toggleSection('utilityBar')}>
              <div className="flex items-center gap-2">
                {openSections.utilityBar ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                <h2 className="text-lg font-bold text-gray-900">Utility Bar Links (Above Nav)</h2>
              </div>
            </div>
            
            {openSections.utilityBar && (
              <div className="mt-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900">Announcement Texts</label>
                      <p className="text-xs text-gray-500 mt-1">These texts will cycle dynamically in the dark bar at the very top of the storefront.</p>
                    </div>
                    <button onClick={addAnnouncement} className="flex items-center gap-1 text-xs text-[#006747] font-medium hover:underline">
                      <Plus className="w-3 h-3" /> Add Announcement
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {utilityBar.announcements?.map((text: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={text} 
                          onChange={(e) => updateAnnouncement(idx, e.target.value)} 
                          className="w-full text-sm border-gray-300 rounded-md p-2 focus:ring-[#006747] focus:border-[#006747]" 
                          placeholder="e.g. Free shipping on all orders over $100!" 
                        />
                        <button onClick={() => removeAnnouncement(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {(!utilityBar.announcements || utilityBar.announcements.length === 0) && (
                      <p className="text-xs text-gray-500 italic">No announcements configured. Default fallback will show.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
        {/* Best Brands Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2 cursor-pointer select-none" onClick={() => toggleSection('bestBrands')}>
            <div className="flex items-center gap-2">
              {openSections.bestBrands ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              <h2 className="text-lg font-bold text-gray-900">Best Brands Carousel</h2>
            </div>
            <button onClick={(e) => { e.stopPropagation(); addBrand(); }} className="flex items-center gap-1 text-sm text-[#006747] font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add Brand
            </button>
          </div>
          
          {openSections.bestBrands && (
          <div className="space-y-4 mt-6">
            {bestBrands.map((brand, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  
                  {/* Brand Image Upload */}
                  <div className="lg:col-span-3 bg-white p-3 border border-gray-200 rounded-md">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Brand Image (Optional)</label>
                    <div className="flex items-center gap-4">
                      {brand.image ? (
                        <div className="relative w-16 h-16 rounded-md border border-gray-200 bg-gray-100 overflow-hidden shrink-0">
                          <img src={brand.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="relative w-16 h-16 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                          <UploadCloud className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadingImage(true);
                              try {
                                const url = await handleImageUpload(e.target.files[0]);
                                updateBrand(idx, 'image', url);
                                showToast("Image uploaded successfully!", 'success');
                              } catch (err) {
                                showToast("Failed to upload image", 'error');
                              }
                              setUploadingImage(false);
                            }
                          }} 
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#006747] file:text-white hover:file:bg-[#00573b] cursor-pointer" 
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Leave blank to use the gradient fallback color.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeBrand(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors mt-6">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {bestBrands.length === 0 && <p className="text-sm text-gray-500 italic">No best brands configured.</p>}
          </div>
          )}
        </div>

        {/* Shop By Category Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2 cursor-pointer select-none" onClick={() => toggleSection('shopByCategory')}>
            <div className="flex items-center gap-2">
              {openSections.shopByCategory ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              <h2 className="text-lg font-bold text-gray-900">Shop By Category Cards</h2>
            </div>
            <button onClick={(e) => { e.stopPropagation(); addCategory(); }} className="flex items-center gap-1 text-sm text-[#006747] font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
          
          {openSections.shopByCategory && (
          <div className="space-y-4 mt-6">
            {shopByCategory.map((cat, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category Title</label>
                    <input type="text" value={cat.name} onChange={(e) => updateCategory(idx, 'name', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. DRIVERS" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description (Multi-line)</label>
                    <textarea 
                      value={cat.desc} 
                      onChange={(e) => updateCategory(idx, 'desc', e.target.value)} 
                      rows={2}
                      className="w-full text-sm border-gray-300 rounded-md focus:ring-[#006747] focus:border-[#006747]" 
                      placeholder="Line 1&#10;Line 2" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">URL Link</label>
                    <input type="text" value={cat.href} onChange={(e) => updateCategory(idx, 'href', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. /category/clubs?type=Drivers" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gradient Classes (Tailwind)</label>
                    <input type="text" value={cat.color} onChange={(e) => updateCategory(idx, 'color', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. from-blue-500/20 to-blue-900/40" />
                  </div>
                  
                  {/* Category Image Upload */}
                  <div className="md:col-span-2 bg-white p-3 border border-gray-200 rounded-md">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Category Image (Optional)</label>
                    <div className="flex items-center gap-4">
                      {cat.image ? (
                        <div className="relative w-16 h-16 rounded-md border border-gray-200 bg-gray-100 overflow-hidden shrink-0">
                          <img src={cat.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="relative w-16 h-16 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                          <UploadCloud className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadingImage(true);
                              try {
                                const url = await handleImageUpload(e.target.files[0]);
                                updateCategory(idx, 'image', url);
                                showToast("Image uploaded successfully!", 'success');
                              } catch (err) {
                                showToast("Failed to upload image", 'error');
                              }
                              setUploadingImage(false);
                            }
                          }} 
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#006747] file:text-white hover:file:bg-[#00573b] cursor-pointer" 
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Leave blank to use the gradient fallback color.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeCategory(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors mt-6">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {shopByCategory.length === 0 && <p className="text-sm text-gray-500 italic">No categories configured.</p>}
          </div>
          )}
        </div>

        {/* Subcategories Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2 cursor-pointer select-none" onClick={() => toggleSection('subCategories')}>
            <div className="flex items-center gap-2">
              {openSections.subCategories ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              <h2 className="text-lg font-bold text-gray-900">Top Clubs / Subcategories</h2>
            </div>
            <button onClick={(e) => { e.stopPropagation(); addSubCategory(); }} className="flex items-center gap-1 text-sm text-[#006747] font-medium hover:underline">
              <Plus className="w-4 h-4" /> Add Subcategory
            </button>
          </div>
          
          {openSections.subCategories && (
          <div className="space-y-4 mt-6">
            {subCategories.map((cat, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Subcategory Name</label>
                    <input type="text" value={cat.name} onChange={(e) => updateSubCategory(idx, 'name', e.target.value)} className="w-full text-sm border-gray-300 rounded-md" placeholder="e.g. DRIVERS" />
                  </div>
                  
                  {/* Subcategory Image Upload */}
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Icon / Image (Optional)</label>
                    <div className="flex items-center gap-4">
                      {cat.image ? (
                        <div className="relative w-16 h-16 rounded-md border border-gray-200 bg-gray-100 overflow-hidden shrink-0 p-2">
                          <img src={cat.image} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="relative w-16 h-16 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                          <UploadCloud className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadingImage(true);
                              try {
                                const url = await handleImageUpload(e.target.files[0]);
                                updateSubCategory(idx, 'image', url);
                                showToast("Image uploaded successfully!", 'success');
                              } catch (err) {
                                showToast("Failed to upload image", 'error');
                              }
                              setUploadingImage(false);
                            }
                          }} 
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#006747] file:text-white hover:file:bg-[#00573b] cursor-pointer" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeSubCategory(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors mt-6">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {subCategories.length === 0 && <p className="text-sm text-gray-500 italic">No subcategories configured.</p>}
          </div>
          )}
        </div>
        </>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl font-medium text-sm flex items-center gap-2 transform transition-all duration-300 translate-y-0 opacity-100 ${toast.type === 'success' ? 'bg-[#006747] text-white' : 'bg-red-500 text-white'}`}>
          {toast.type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
