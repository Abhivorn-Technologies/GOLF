import React from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
        <p className="text-gray-500 mt-1">Create a new product to list on your store.</p>
      </div>

      <ProductForm />
    </div>
  );
}
