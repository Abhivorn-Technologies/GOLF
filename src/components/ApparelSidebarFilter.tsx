import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from './DynamicSidebarFilter';

export default async function ApparelSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Apparel'] || { brands: [], attributes: {} };
  
  return <DynamicSidebarFilter filterData={categoryData} />;
}
