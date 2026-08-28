import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from "@/app/(storefront)/category/_components/DynamicSidebarFilter";
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export default async function BagsSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Bags'] || { brands: [], attributes: {} };
  
  await dbConnect();
  const settings = await PageSettings.findOne({ page: 'bags' }).lean();

  let allowedAttributes = settings?.allowedFilters || [];
  
  return <DynamicSidebarFilter filterData={categoryData} allowedAttributes={allowedAttributes} />;
}
