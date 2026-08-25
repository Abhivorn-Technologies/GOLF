"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UploadCloud, X, Loader2 } from 'lucide-react';

export default function BrandForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      let imageUrl = initialData?.imageUrl || '';

      // Upload image first if a new one was selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: imageFormData
        });
        
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      if (!imageUrl) throw new Error('Brand logo image is required');

      // Create or Update Brand
      const brandData = {
        name: formData.get('name'),
        imageUrl: imageUrl,
        isActive: formData.get('isActive') === 'on',
        displayOrder: Number(formData.get('displayOrder')) || 0,
      };

      if (!brandData.name) throw new Error('Brand name is required');

      const url = initialData ? `/api/admin/brands/${initialData._id}` : '/api/admin/brands';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to save brand');
      }

      router.push('/admin/brands');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-12 flex justify-center items-center h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 space-y-8" suppressHydrationWarning>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
            <input 
              name="name" 
              defaultValue={initialData?.name} 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none"
              placeholder="e.g. TaylorMade"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Order (Lower numbers show first)</label>
            <input 
              name="displayOrder" 
              type="number"
              defaultValue={initialData?.displayOrder || 0} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:border-black focus:ring-2 focus:ring-gray-200 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="isActive" id="isActive" defaultChecked={initialData?.isActive !== false} className="w-5 h-5 rounded text-black focus:ring-black" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Brand is Active</label>
          </div>
        </div>

        {/* Image Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand Logo (Square or Landscape recommended)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl h-[200px] flex flex-col items-center justify-center relative bg-gray-50/50 hover:bg-gray-50 transition-colors overflow-hidden group">
            {imagePreview ? (
              <>
                <Image src={imagePreview} alt="Preview" fill className="object-contain p-4" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button" 
                    onClick={() => { setImagePreview(null); setImageFile(null); }}
                    className="bg-white text-red-600 p-3 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-6 pointer-events-none">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                  <UploadCloud className="w-8 h-8 text-black" />
                </div>
                <p className="text-sm font-medium text-gray-900">Click to upload logo</p>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title=""
            />
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
          {initialData ? 'Save Changes' : 'Create Brand'}
        </button>
      </div>
    </form>
  );
}
