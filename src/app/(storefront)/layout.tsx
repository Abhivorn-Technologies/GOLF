import React from 'react';
import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import { getMegaMenuData } from "@/lib/filters";

export const dynamic = 'force-dynamic';

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const megaMenuData = await getMegaMenuData();

  return (
    <div className="min-h-full flex flex-col">
      <TopNavBar megaMenuData={megaMenuData} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
