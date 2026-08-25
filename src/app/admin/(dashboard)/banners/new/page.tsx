import React from 'react';
import BannerForm from '@/components/admin/BannerForm';

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Banner</h1>
        <p className="text-gray-500 mt-1">Upload a hero image for the homepage carousel.</p>
      </div>

      <BannerForm />
    </div>
  );
}
