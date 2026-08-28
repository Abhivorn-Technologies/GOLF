import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from "@/app/(storefront)/category/_components/DynamicSidebarFilter";
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export default async function ClubsSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Clubs'] || { brands: [], attributes: {} };
  
  await dbConnect();
  const settings = await PageSettings.findOne({ page: 'clubs' }).lean();

  let allowedAttributes = settings?.allowedFilters || [];
  
  return <DynamicSidebarFilter filterData={categoryData} allowedAttributes={allowedAttributes} />;
}
