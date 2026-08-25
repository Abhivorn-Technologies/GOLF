import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from './DynamicSidebarFilter';

export default async function BagsSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Bags'] || { brands: [], attributes: {} };
  
  return <DynamicSidebarFilter filterData={categoryData} />;
}
