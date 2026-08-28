import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from "@/app/(storefront)/category/_components/DynamicSidebarFilter";
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export default async function ApparelSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Apparel'] || { brands: [], attributes: {} };
  
  await dbConnect();
  const settings = await PageSettings.findOne({ page: 'apparel' }).lean();

  let allowedAttributes = settings?.allowedFilters || [];
  
  return <DynamicSidebarFilter filterData={categoryData} allowedAttributes={allowedAttributes} />;
}
