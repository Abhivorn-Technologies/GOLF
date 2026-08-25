import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from './DynamicSidebarFilter';

export default async function AccessoriesSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Accessories'] || { brands: [], attributes: {} };
  
  return <DynamicSidebarFilter filterData={categoryData} />;
}
