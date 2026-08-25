import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from './DynamicSidebarFilter';

export default async function ShoesSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Shoes'] || { brands: [], attributes: {} };
  
  return <DynamicSidebarFilter filterData={categoryData} />;
}
