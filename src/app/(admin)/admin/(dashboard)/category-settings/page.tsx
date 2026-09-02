import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import CategorySettingsClient from './CategorySettingsClient';

export default async function CategorySettingsPage() {
  // Fetch all unique attributes available in the database across all products
  const filterData = await getMegaMenuData();
  
  return (
    <div className="w-full">
      <div className="w-full">
        <h1 className="text-3xl font-black mb-2">Category Filters</h1>
        <p className="text-gray-500 mb-8 max-w-4xl">
          Manage which dynamic attribute filters appear on the sidebar of each category page. 
          The system automatically detects all custom attributes across your products.
        </p>

        <CategorySettingsClient filterData={filterData} />
      </div>
    </div>
  );
}
