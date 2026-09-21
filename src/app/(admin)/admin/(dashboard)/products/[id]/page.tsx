import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import mongoose from 'mongoose';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await dbConnect();
  
  let product = null;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }
    if (!product) {
      product = await Product.findOne({ slug: id }).lean();
    }
  } catch (err) {
    console.error("Error fetching product for edit:", err);
  }
  
  if (!product) {
    notFound();
  }
  
  // Safely serialize entire mongoose document (converts nested ObjectIds and Dates to strings)
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm flex items-center justify-center"
          title="Back to Products"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Product</h1>
          <p className="text-gray-500 mt-1">Update product details and inventory.</p>
        </div>
      </div>

      <ProductForm initialData={serializedProduct} />
    </div>
  );
}
