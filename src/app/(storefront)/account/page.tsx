import React from 'react';
import AccountSidebar from "@/app/(storefront)/account/_components/AccountSidebar";
import AccountInformation from "@/app/(storefront)/account/_components/AccountInformation";

export default function AccountPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Account Navigation Sidebar */}
          <AccountSidebar />

          {/* Main Content Area */}
          <div className="flex-1 w-full">
            <AccountInformation />
          </div>
          
        </div>
      </div>
    </div>
  );
}
