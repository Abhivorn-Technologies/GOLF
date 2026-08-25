import React from 'react';
import AccountSidebar from '@/components/AccountSidebar';
import AccountInformation from '@/components/AccountInformation';

export default function AccountPage() {
  return (
    <div className="bg-[#f4f4f5] min-h-screen">
      {/* Breadcrumb / Top Spacing (similar to Figma padding) */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-8">
        {/* We can add a breadcrumb here if needed */}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 flex flex-col md:flex-row gap-12 items-start">
        
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
