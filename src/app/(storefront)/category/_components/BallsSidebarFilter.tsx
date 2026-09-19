import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from "@/app/(storefront)/category/_components/DynamicSidebarFilter";
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export default async function BallsSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Balls'] || { brands: [], attributes: {} };
  
  await dbConnect();
  const settings = await PageSettings.findOne({ page: 'balls' }).lean();

  const allowedAttributes = settings?.allowedFilters || [];
  
  return <DynamicSidebarFilter filterData={categoryData} allowedAttributes={allowedAttributes} />;
}
