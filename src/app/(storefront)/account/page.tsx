import React from 'react';
import AccountSidebar from "@/app/(storefront)/account/_components/AccountSidebar";
import AccountInformation from "@/app/(storefront)/account/_components/AccountInformation";
import AccountLogoutButton from "@/app/(storefront)/account/_components/AccountLogoutButton";

export default function AccountPage() {
  return (
    <div className="bg-white">
      {/* Breadcrumb / Top Spacing */}
      <div className="w-full px-4 md:px-8 pt-4 flex justify-end">
        <AccountLogoutButton />
      </div>

      <div className="w-full px-4 md:px-8 py-6 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        
        {/* Account Navigation Sidebar */}
        <AccountSidebar />

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <AccountInformation />
        </div>
        
      </div>
    </div>
  );
}
