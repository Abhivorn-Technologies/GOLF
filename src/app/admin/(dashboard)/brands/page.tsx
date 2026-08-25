import React from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, MoveUp, MoveDown } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';
import Link from 'next/link';

async function getBrands() {
  try {
    await dbConnect();
    const brands = await Brand.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return brands as any[];
  } catch (error) {
    console.error("Failed to fetch brands", error);
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Brands Management</h1>
          <p className="text-gray-500 mt-1">Manage the brands displayed in the "Brands We Love" section.</p>
        </div>
        <Link 
          href="/admin/brands/new"
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/images/golf.png" alt="Icon" width={32} height={32} className="opacity-50 grayscale" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Brands Found</h3>
            <p className="text-gray-500 mb-6">You haven't created any brands yet.</p>
            <Link href="/admin/brands/new" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create First Brand
            </Link>
          </div>
        ) : (
          brands.map((brand, index) => (
            <div key={brand._id.toString()} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all">
              
              {/* Image Preview */}
              <div className="w-full h-48 relative bg-gray-50 p-4 border-b border-gray-100">
                <Image 
                  src={brand.imageUrl} 
                  alt={brand.name} 
                  fill 
                  className="object-contain p-4"
                />
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded backdrop-blur-sm ${brand.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {brand.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">{brand.name}</h2>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-400">
                    Order: {brand.displayOrder || index + 1}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/brands/${brand._id}/edit`} className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
