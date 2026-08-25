import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from './DynamicSidebarFilter';

export default async function ClubsSidebarFilter() {
  const data = await getMegaMenuData();
  const categoryData = data['Clubs'] || { brands: [], attributes: {} };
  
  // Figma explicitly specifies only Dexterity (Hand) and Flex for Clubs dynamic attributes
  const allowedAttributes = ['Hand', 'Dexterity', 'Flex', 'Style'];
  
  return <DynamicSidebarFilter filterData={categoryData} allowedAttributes={allowedAttributes} />;
}
