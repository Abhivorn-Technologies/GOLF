import React, { Suspense } from 'react';
import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import GlobalBackButton from "@/components/GlobalBackButton";
import { getMegaMenuData } from "@/lib/filters";
import { getPageSettings } from "@/lib/pageSettings";

export const dynamic = 'force-dynamic';

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  let megaMenuData: any = {};
  let utilityBar: any = null;

  try {
    const [menuData, globalSettings] = await Promise.all([
      getMegaMenuData(),
      getPageSettings('global')
    ]);
    megaMenuData = menuData || {};
    if (globalSettings) {
      utilityBar = globalSettings?.utilityBar ?? null;
    }
  } catch (e) {
    // DB unavailable — render nav cleanly
  }

  return (
    <div className="min-h-screen flex flex-col max-w-[100vw]">
      <TopNavBar megaMenuData={megaMenuData} utilityBar={utilityBar} />
      <Suspense fallback={null}>
        <GlobalBackButton />
      </Suspense>
      <main className="flex-1 overflow-x-clip">
        {children}
      </main>
      <Footer />
    </div>
  );
}
