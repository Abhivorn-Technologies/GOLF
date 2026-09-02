import React from 'react';


import AccountSidebar from "@/app/(storefront)/account/_components/AccountSidebar";
import AccountOrders from "@/app/(storefront)/account/_components/AccountOrders";
import AccountLogoutButton from "@/app/(storefront)/account/_components/AccountLogoutButton";

export default function OrdersPage() {
  return (
    <div className="bg-white flex flex-col font-sans">
      
      
      <main className="flex-1">
        {/* Breadcrumb / Top Spacing (similar to Figma padding) */}
        <div className="w-full px-4 md:px-8 pt-4 flex justify-end">
          <AccountLogoutButton />
        </div>

        <div className="w-full px-4 md:px-8 py-6 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          
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
