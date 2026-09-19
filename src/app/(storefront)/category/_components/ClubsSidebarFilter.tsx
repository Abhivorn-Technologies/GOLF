import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from "@/app/(storefront)/category/_components/DynamicSidebarFilter";
import { getPageSettings } from '@/lib/pageSettings';

export default async function ClubsSidebarFilter() {
  let categoryData: any = { brands: [], attributes: {} };
  let allowedAttributes: any[] = [];

  try {
    const [data, settings] = await Promise.all([
      getMegaMenuData(),
      getPageSettings('clubs')
    ]);
    categoryData = data['Clubs'] || { brands: [], attributes: {} };
    if (settings) {
      allowedAttributes = settings.allowedFilters || [];
    }
  } catch (e) {
    console.error("ClubsSidebarFilter DB error, using fallback:", e);
  }

  return <DynamicSidebarFilter filterData={categoryData} allowedAttributes={allowedAttributes} />;
}
