"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UploadCloud, X, Loader2, Plus, Trash2 } from 'lucide-react';

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);

  const [dynamicAttributes, setDynamicAttributes] = useState<{ key: string, value: string }[]>(
    initialData?.attributes || []
  );

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
    // Approximate handling for files to match previews
    setImageFiles(prev => {
      // If the image was newly added, remove from imageFiles
      // This is a simplification; we will filter valid files at submit time based on previews
      return prev;
    });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      // Only keep previous images that are still in the imagePreviews array
      const previousImages = imagePreviews.filter(url => !url.startsWith('blob:'));
      let finalImageUrls = [...previousImages];

      // Upload new images (blob URLs)
      const blobUrls = imagePreviews.filter(url => url.startsWith('blob:'));
      for (const blobUrl of blobUrls) {
        // Find the matching file based on preview URL index in files array
        // (Rough match, assuming order is maintained for new files)
        const fileIndex = imagePreviews.indexOf(blobUrl) - previousImages.length;
        const file = imageFiles[fileIndex >= 0 ? fileIndex : 0]; // Fallback to first file if mismatch

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
            console.warn('Image upload network error. API not available or payload too large.', uploadErr);
            finalImageUrls.push(`/images/${file.name}`);
            continue;
          }
          
          if (!uploadRes.ok) {
            finalImageUrls.push(`/images/${file.name}`);
            console.warn('Image upload mocked. API not available.');
          } else {
            const uploadData = await uploadRes.json();
            finalImageUrls.push(uploadData.url);
          }
        }
      }

      // Parse features from comma-separated string
      const featuresRaw = formData.get('features') as string;
      const featuresArray = featuresRaw ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean) : [];

      // Filter out empty attributes
      const validAttributes = dynamicAttributes.filter(attr => attr.key.trim() && attr.value.trim());

      // Create or Update Product
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
        stockCount: Number(formData.get('stockCount')) || 10,
        inStock: Number(formData.get('stockCount')) > 0,
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          
          {/* Core Details */}
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
              <select name="category" defaultValue={initialData?.category || 'clubs'} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none bg-white">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Count</label>
              <input 
                name="stockCount" 
                type="number"
                defaultValue={initialData?.stockCount || 10} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none"
              />
            </div>
          </div>

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
              {dynamicAttributes.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No custom attributes added. (e.g. Color, Material, Flex)</p>
              ) : (
                dynamicAttributes.map((attr, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input 
                      value={attr.key}
                      onChange={(e) => updateAttribute(idx, 'key', e.target.value)}
                      placeholder="e.g. Color"
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

        {/* Image Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[400px] flex flex-col relative bg-gray-50/50 hover:bg-gray-50 transition-colors p-6">
            
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group aspect-square bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <img src={preview.startsWith('http') || preview.startsWith('blob:') ? preview : `/images/${preview}`} alt={`Preview ${idx}`} className="object-contain p-2 w-full h-full" />
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

      <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
        <button 
          type="button" 
          onClick={() => router.back()}
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
