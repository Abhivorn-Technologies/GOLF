import React from 'react';
import BrandForm from '@/components/admin/BrandForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';
import { notFound } from 'next/navigation';

async function getBrand(id: string) {
  try {
    await dbConnect();
    const brand = await Brand.findById(id).lean();
    if (!brand) return null;
    
    return JSON.parse(JSON.stringify(brand)); // Serialize for client component
  } catch (error) {
    console.error("Failed to fetch brand", error);
    return null;
  }
}

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const brand = await getBrand(resolvedParams.id);

  if (!brand) {
    notFound();
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Brand</h1>
          <p className="text-gray-500 mt-1">Update the details for {brand.name}.</p>
        </div>
      </div>

      <BrandForm initialData={brand} />
    </div>
  );
}
