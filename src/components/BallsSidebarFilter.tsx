import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from './DynamicSidebarFilter';

export default async function BallsSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Balls'] || { brands: [], attributes: {} };
  
  return <DynamicSidebarFilter filterData={categoryData} />;
}
