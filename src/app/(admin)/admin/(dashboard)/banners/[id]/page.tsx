import React from 'react';
import BannerForm from '@/components/admin/BannerForm';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { notFound } from 'next/navigation';

export default async function EditBannerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  
  const banner = await Banner.findById(params.id).lean();
  
  if (!banner) {
    notFound();
  }

  // Convert MongoDB ObjectId to string so it can be passed to the Client Component
  const serializedBanner = JSON.parse(JSON.stringify(banner));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Banner</h1>
        <p className="text-gray-500 mt-1">Update your hero image and Canvas content.</p>
      </div>

      <BannerForm initialData={serializedBanner} />
    </div>
  );
}
