import React from 'react';
import { getMegaMenuData } from '@/lib/filters';
import DynamicSidebarFilter from "@/app/(storefront)/category/_components/DynamicSidebarFilter";
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export default async function ApparelSidebarFilter() {
  let categoryData: any = { brands: [], attributes: {} };
  let allowedAttributes: any[] = [];

  try {
    const data = await getMegaMenuData();
    categoryData = data['Apparel'] || { brands: [], attributes: {} };
    await dbConnect();
    const settings = await PageSettings.findOne({ page: 'apparel' }).lean();
    if (settings) {
      allowedAttributes = settings.allowedFilters || [];
    }
  } catch (e) {
    console.error("ApparelSidebarFilter DB error, using fallback:", e);
  }

  return <DynamicSidebarFilter filterData={categoryData} allowedAttributes={allowedAttributes} />;
}
