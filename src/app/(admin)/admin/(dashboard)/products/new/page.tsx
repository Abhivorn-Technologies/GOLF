import React from 'react';
import ProductForm from '@/components/admin/ProductForm';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products" 
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm flex items-center justify-center"
          title="Back to Products"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
          <p className="text-gray-500 mt-1">Create a new product to list on your store.</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
