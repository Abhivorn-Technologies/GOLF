import React from 'react';
import BrandForm from '@/components/admin/BrandForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewBrandPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Brand</h1>
          <p className="text-gray-500 mt-1">Add a new brand to display on the store.</p>
        </div>
      </div>

      <BrandForm />
    </div>
  );
}
