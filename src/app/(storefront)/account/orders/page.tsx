import React from 'react';


import AccountSidebar from "@/app/(storefront)/account/_components/AccountSidebar";
import AccountOrders from "@/app/(storefront)/account/_components/AccountOrders";

export default function OrdersPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      
      
      <main className="flex-1">
        {/* Breadcrumb / Top Spacing (similar to Figma padding) */}
        <div className="max-w-[1280px] mx-auto px-[64px] pt-[32px]">
          {/* Spacing for breadcrumbs if needed in the future */}
        </div>

        <div className="max-w-[1280px] mx-auto px-[64px] py-[32px] flex flex-col md:flex-row gap-[48px] items-start">
          
          {/* Account Navigation Sidebar */}
          <AccountSidebar />

          {/* Main Content Area */}
          <div className="flex-1 w-full">
            <AccountOrders />
          </div>
          
        </div>
      </main>

      
    </div>
  );
}
