import React from 'react';
import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import GlobalBackButton from "@/components/GlobalBackButton";
import { getMegaMenuData } from "@/lib/filters";
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

export const dynamic = 'force-dynamic';

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const megaMenuData = await getMegaMenuData();
  
  await dbConnect();
  const globalSettings = await PageSettings.findOne({ page: 'global' }).lean();
  const plainGlobalSettings = globalSettings ? JSON.parse(JSON.stringify(globalSettings)) : null;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-[100vw]">
      <TopNavBar megaMenuData={megaMenuData} utilityBar={plainGlobalSettings?.utilityBar} />
      <GlobalBackButton />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
