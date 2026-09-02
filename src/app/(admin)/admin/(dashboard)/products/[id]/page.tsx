import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  await dbConnect();
  
  const product = await Product.findById(id).lean();
  
  if (!product) {
    notFound();
  }
  
  // Safely serialize entire mongoose document (converts nested ObjectIds and Dates to strings)
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Product</h1>
        <p className="text-gray-500 mt-1">Update product details and inventory.</p>
      </div>

      <ProductForm initialData={serializedProduct} />
    </div>
  );
}
