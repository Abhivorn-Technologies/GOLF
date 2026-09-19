"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UploadCloud, X, Loader2, Plus, Trash2 } from 'lucide-react';

function resolveImg(src: string) {
  if (!src) return '/images/golf.png';
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/') || src.startsWith('blob:')) return src;
  return `/images/${src}`;
}

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);

  const [dynamicAttributes, setDynamicAttributes] = useState<{ key: string, value: string }[]>(
    initialData?.attributes || []
  );
  
  const [colorGroups, setColorGroups] = useState<{
    id: string;
    colorName: string;
    colorCode: string;
    images: string[];
    newFiles: File[];
    sizes: { id: string; size: string; stockCount: number }[];
  }[]>(() => {
    if (!initialData?.variants) return [];
    const groups = new Map();
    initialData.variants.forEach((v: any) => {
      if (!groups.has(v.color)) {
        groups.set(v.color, {
          id: Date.now().toString() + Math.random(),
          colorName: v.color || '',
          colorCode: v.colorCode || '#000000',
          images: v.images || [],
          newFiles: [],
          sizes: []
        });
      }
      if (v.size || v.stockCount > 0) {
        groups.get(v.color).sizes.push({ id: Date.now().toString() + Math.random(), size: v.size, stockCount: v.stockCount });
      }
    });
    return Array.from(groups.values());
  });
  
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || 'clubs');
  const [stockCountValue, setStockCountValue] = useState<number | ''>(initialData?.stockCount ?? 10);
  const [availableAttributes, setAvailableAttributes] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await fetch(`/api/admin/attributes?category=${selectedCategory}`);
        if (res.ok) {
          const data = await res.json();
          setAvailableAttributes(data.attributes || []);
        }
      } catch (err) {
        console.error('Failed to fetch available attributes:', err);
      }
    };
    fetchAttributes();
  }, [selectedCategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setImageFiles(prev => [...prev, ...files]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev);
  };

  const addAttribute = () => setDynamicAttributes([...dynamicAttributes, { key: '', value: '' }]);
  
  const updateAttribute = (index: number, field: 'key'|'value', val: string) => {
    const newAttrs = [...dynamicAttributes];
    newAttrs[index][field] = val;
    setDynamicAttributes(newAttrs);
  };
  
  const removeAttribute = (index: number) => {
    setDynamicAttributes(dynamicAttributes.filter((_, i) => i !== index));
  };

  const addColorGroup = () => {
    setColorGroups([...colorGroups, { id: Date.now().toString(), colorName: '', colorCode: '#000000', images: [], newFiles: [], sizes: [] }]);
  };
  const removeColorGroup = (idx: number) => {
    setColorGroups(colorGroups.filter((_, i) => i !== idx));
  };
  const updateColorGroup = (idx: number, field: string, val: any) => {
    const newGroups = [...colorGroups];
    (newGroups[idx] as any)[field] = val;
    setColorGroups(newGroups);
  };
  const addSizeToGroup = (groupIdx: number) => {
    const newGroups = [...colorGroups];
    newGroups[groupIdx].sizes.push({ id: Date.now().toString() + Math.random(), size: '', stockCount: 0 });
    setColorGroups(newGroups);
  };
  const removeSizeFromGroup = (groupIdx: number, sizeIdx: number) => {
    const newGroups = [...colorGroups];
    newGroups[groupIdx].sizes.splice(sizeIdx, 1);
    setColorGroups(newGroups);
  };
  const updateSizeInGroup = (groupIdx: number, sizeIdx: number, field: string, val: any) => {
    const newGroups = [...colorGroups];
    (newGroups[groupIdx].sizes[sizeIdx] as any)[field] = val;
    setColorGroups(newGroups);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const previousImages = imagePreviews.filter(url => !url.startsWith('blob:'));
      const finalImageUrls = [...previousImages];

      const blobUrls = imagePreviews.filter(url => url.startsWith('blob:'));
      for (const blobUrl of blobUrls) {
        const fileIndex = imagePreviews.indexOf(blobUrl) - previousImages.length;
        const file = imageFiles[fileIndex >= 0 ? fileIndex : 0]; 

        if (file) {
          const imageFormData = new FormData();
          imageFormData.append('file', file);
          
          let uploadRes;
          try {
            uploadRes = await fetch('/api/admin/upload', {
              method: 'POST',
              body: imageFormData
            });
          } catch (uploadErr) {
            finalImageUrls.push(`/images/${file.name}`);
            continue;
          }
          
          if (!uploadRes.ok) {
            finalImageUrls.push(`/images/${file.name}`);
          } else {
            const uploadData = await uploadRes.json();
            finalImageUrls.push(uploadData.url);
          }
        }
      }

      const finalVariants: any[] = [];
      for (let i = 0; i < colorGroups.length; i++) {
        const cg = colorGroups[i];
        let finalGroupImages = [...cg.images];
        if (cg.newFiles && cg.newFiles.length > 0) {
          for (const file of cg.newFiles) {
            const imageFormData = new FormData();
            imageFormData.append('file', file);
            try {
              const res = await fetch('/api/admin/upload', { method: 'POST', body: imageFormData });
              if (res.ok) {
                const data = await res.json();
                finalGroupImages.push(data.url);
              } else {
                finalGroupImages.push(`/images/${file.name}`);
              }
            } catch (err) {
              finalGroupImages.push(`/images/${file.name}`);
            }
          }
        }
        
        finalGroupImages = finalGroupImages.filter(img => !img.startsWith('blob:'));
        
        if (cg.sizes.length === 0) {
          finalVariants.push({
             id: Date.now().toString() + Math.random(),
             color: cg.colorName,
             colorCode: cg.colorCode,
             size: '',
             stockCount: 0,
             images: finalGroupImages
          });
        } else {
          for (const s of cg.sizes) {
             finalVariants.push({
                id: Date.now().toString() + Math.random(),
                color: cg.colorName,
                colorCode: cg.colorCode,
                size: s.size,
                stockCount: s.stockCount,
                images: finalGroupImages
             });
          }
        }
      }

      const featuresRaw = formData.get('features') as string;
      const featuresArray = featuresRaw ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean) : [];

      const validAttributes = dynamicAttributes.filter(attr => attr.key.trim() && attr.value.trim());

      const variantStockCount = finalVariants.reduce((sum, v) => sum + (Number(v.stockCount) || 0), 0);
      const baseStockCount = Number(formData.get('stockCount')) || 0;
      const totalStockCount = finalVariants.length > 0 ? variantStockCount : (baseStockCount || 10);

      const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        compareAtPrice: formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : null,
        brand: formData.get('brand'),
        type: formData.get('type'),
        category: formData.get('category'),
        gender: formData.get('gender'),
        style: formData.get('style'),
        loft: formData.get('loft'),
        size: formData.get('size'),
        features: featuresArray,
        attributes: validAttributes,
        images: finalImageUrls,
        variants: finalVariants,
        stockCount: totalStockCount,
        inStock: totalStockCount > 0,
        isFeatured: formData.get('isFeatured') === 'on',
        isTopDeal: formData.get('isTopDeal') === 'on',
        isNewArrival: formData.get('isNewArrival') === 'on',
      };

      const url = initialData ? `/api/admin/products/${initialData._id}` : '/api/admin/products';
      const method = initialData ? 'PUT' : 'POST';

      let res;
      try {
        res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } catch (fetchErr) {
        throw new Error('Network error: Could not reach the server to save the product.');
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save product on the server.');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border-0 p-6 md:p-10 space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* TOP GRID (Core Details + Images) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Details (Left) */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
            <input 
              name="title" 
              defaultValue={initialData?.title} 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none"
              placeholder="e.g. Callaway Paradym Driver"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <div className="flex gap-2">
                <input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  defaultValue={initialData?.price} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  placeholder="Sale Price"
                />
                <input 
                  name="compareAtPrice" 
                  type="number" 
                  step="0.01" 
                  defaultValue={initialData?.compareAtPrice} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  placeholder="MSRP (Compare At)"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input 
                name="brand" 
                defaultValue={initialData?.brand} 
                required 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                placeholder="e.g. Callaway"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                name="category" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none bg-white"
              >
                <option value="clubs">Clubs</option>
                <option value="apparel">Apparel</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
                <option value="bags">Bags</option>
                <option value="balls">Balls</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type / Sub-Category</label>
              <input 
                name="type" 
                defaultValue={initialData?.type} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                placeholder="e.g. Stand Bags"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender (Optional)</label>
              <select name="gender" defaultValue={initialData?.gender || ""} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none bg-white">
                <option value="">None / Not Applicable</option>
                <option value="Men's">Men's</option>
                <option value="Women's">Women's</option>
                <option value="Unisex">Unisex</option>
                <option value="Juniors">Juniors</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Count
                {colorGroups.length > 0 && <span className="text-xs font-normal text-amber-600 ml-2">(Auto-calculated from variants)</span>}
              </label>
              <input 
                name="stockCount" 
                type="number"
                disabled={colorGroups.length > 0}
                value={colorGroups.length > 0 ? colorGroups.reduce((acc, g) => acc + g.sizes.reduce((sAcc, s) => sAcc + (Number(s.stockCount) || 0), 0), 0) : (stockCountValue ?? '')}
                onChange={(e) => setStockCountValue(e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 transition-all outline-none ${colorGroups.length > 0 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:border-black focus:ring-2 focus:ring-gray-200'}`}
              />
            </div>
          </div>
        </div>

        {/* Image Upload Area (Right) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[400px] flex flex-col relative bg-gray-50/50 hover:bg-gray-50 transition-colors p-6">
            
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group aspect-square bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <img src={resolveImg(preview)} alt={`Preview ${idx}`} className="object-contain p-2 w-full h-full" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); removeImage(idx); }}
                        className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {/* Add more button */}
                <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-black">
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Add More</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title=""
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                      <UploadCloud className="w-8 h-8 text-black" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Click to upload images</p>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB. Select multiple.</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title=""
                />
              </>
            )}
          </div>
        </div>
      </div>
      {/* END TOP GRID */}

      {/* FULL WIDTH LOWER SECTION */}
      <div className="space-y-6">
        
        {/* Advanced Attributes */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Style (Comma separated)</label>
            <input name="style" defaultValue={initialData?.style} placeholder="Spiked:5, Spikeless:0" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Loft (Comma separated)</label>
            <input name="loft" defaultValue={initialData?.loft} placeholder="9.0°:2, 10.5°:0" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Size (Comma separated)</label>
            <input name="size" defaultValue={initialData?.size} placeholder="S:10, M:0, L:5" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200" />
          </div>
        </div>

        {/* Dynamic Attributes Builder */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-bold text-gray-700">Dynamic Attributes</label>
            <button 
              type="button" 
              onClick={addAttribute}
              className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Attribute
            </button>
          </div>
          
          <div className="space-y-3">
            <datalist id="available-attributes">
              {availableAttributes.map(attr => (
                <option key={attr} value={attr} />
              ))}
            </datalist>
            {dynamicAttributes.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No custom attributes added. (e.g. Color, Material, Flex)</p>
            ) : (
              dynamicAttributes.map((attr, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input 
                    value={attr.key}
                    onChange={(e) => updateAttribute(idx, 'key', e.target.value)}
                    placeholder="e.g. Color"
                    list="available-attributes"
                    className="w-1/3 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-black outline-none"
                  />
                  <input 
                    value={attr.value}
                    onChange={(e) => updateAttribute(idx, 'value', e.target.value)}
                    placeholder="e.g. Matte Black"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-black outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => removeAttribute(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Variants Builder Overhaul */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-bold text-gray-700">Product Variants (Grouped by Color)</label>
            <button 
              type="button" 
              onClick={addColorGroup}
              className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Color Group
            </button>
          </div>
          
          <div className="space-y-6">
            {colorGroups.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No color groups added. Stock will be managed globally for this product.</p>
            ) : (
              colorGroups.map((group, idx) => (
                <div key={group.id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm relative">
                  <button 
                    type="button"
                    onClick={() => removeColorGroup(idx)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-50 rounded p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="flex flex-col gap-4 pr-6">
                    
                    {/* Color Header */}
                    <div className="flex gap-4 items-center">
                      <div className="w-1/3">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Color Name</label>
                        <input 
                          value={group.colorName}
                          onChange={(e) => updateColorGroup(idx, 'colorName', e.target.value)}
                          placeholder="e.g. Navy Blue"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-black outline-none"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Color Hex</label>
                        <div className="flex gap-2 items-center">
                          <input 
                            type="color"
                            value={group.colorCode}
                            onChange={(e) => updateColorGroup(idx, 'colorCode', e.target.value)}
                            className="w-8 h-8 rounded border-0 cursor-pointer p-0"
                          />
                          <input 
                            value={group.colorCode}
                            onChange={(e) => updateColorGroup(idx, 'colorCode', e.target.value)}
                            placeholder="#000080"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-black outline-none uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Color Images */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Color Images (Upload once for all sizes in this color)</label>
                      <div className="flex gap-3 items-center flex-wrap">
                        {group.images?.map((img, iIdx) => (
                          <div key={iIdx} className="relative w-16 h-16 border border-gray-200 rounded-lg group overflow-hidden bg-gray-50">
                            <img src={resolveImg(img)} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => {
                                const newGroups = [...colorGroups];
                                newGroups[idx].images.splice(iIdx, 1);
                                setColorGroups(newGroups);
                              }}
                              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <label className="w-16 h-16 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors rounded-lg text-gray-400 hover:text-black">
                          <Plus className="w-5 h-5" />
                          <input 
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) {
                                const files = Array.from(e.target.files);
                                const previews = files.map(f => URL.createObjectURL(f));
                                const newGroups = [...colorGroups];
                                newGroups[idx].images = [...(newGroups[idx].images || []), ...previews];
                                newGroups[idx].newFiles = [...(newGroups[idx].newFiles || []), ...files];
                                setColorGroups(newGroups);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Sizes within this color */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-xs font-bold text-gray-700 uppercase">Sizes for {group.colorName || 'this color'}</label>
                        <button 
                          type="button" 
                          onClick={() => addSizeToGroup(idx)}
                          className="text-[10px] font-bold bg-white border border-gray-200 text-black px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add Size
                        </button>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {group.sizes.length === 0 ? (
                          <span className="text-xs text-gray-500 italic">No specific sizes added. (Will apply stock to the general color)</span>
                        ) : (
                          group.sizes.map((size, sIdx) => (
                            <div key={size.id} className="flex gap-2 items-center">
                              <input 
                                value={size.size}
                                onChange={(e) => updateSizeInGroup(idx, sIdx, 'size', e.target.value)}
                                placeholder="Size (e.g. M, 10.5)"
                                className="w-1/3 px-3 py-1.5 text-sm rounded border border-gray-200 focus:border-black outline-none"
                              />
                              <input 
                                type="number"
                                value={size.stockCount}
                                onChange={(e) => updateSizeInGroup(idx, sIdx, 'stockCount', parseInt(e.target.value) || 0)}
                                placeholder="Stock"
                                className="w-1/3 px-3 py-1.5 text-sm rounded border border-gray-200 focus:border-black outline-none"
                              />
                              <button 
                                type="button"
                                onClick={() => removeSizeFromGroup(idx, sIdx)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            name="description" 
            defaultValue={initialData?.description} 
            rows={3}
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none resize-none"
            placeholder="Product description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Features (Comma separated)</label>
          <textarea 
            name="features" 
            defaultValue={initialData?.features?.join(', ')} 
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none resize-none text-sm"
            placeholder="e.g. Waterproof, Lightweight, Premium Grip"
          />
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={initialData?.isFeatured} className="w-5 h-5 rounded text-black focus:ring-black" />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Feature this product on homepage (Categories/General)</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="isTopDeal" id="isTopDeal" defaultChecked={initialData?.isTopDeal} className="w-5 h-5 rounded text-black focus:ring-black" />
            <label htmlFor="isTopDeal" className="text-sm font-medium text-gray-700">Feature in "Top Deals" section (Requires Compare At Price)</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="isNewArrival" id="isNewArrival" defaultChecked={initialData?.isNewArrival} className="w-5 h-5 rounded text-black focus:ring-black" />
            <label htmlFor="isNewArrival" className="text-sm font-medium text-gray-700">Feature in "New Arrivals" section</label>
          </div>
        </div>

      </div>
      {/* END FULL WIDTH SECTION */}

      <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
        <button 
          type="button" 
          onClick={() => router.push('/admin/products')}
          className="px-6 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-3 rounded-xl font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-70 transition-colors flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
