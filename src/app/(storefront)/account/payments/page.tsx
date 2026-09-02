import React from 'react';


import AccountSidebar from "@/app/(storefront)/account/_components/AccountSidebar";
import AccountPayments from "@/app/(storefront)/account/_components/AccountPayments";
import AccountLogoutButton from "@/app/(storefront)/account/_components/AccountLogoutButton";

export default function PaymentsPage() {
  return (
    <div className="bg-white flex flex-col font-sans">
      
      
      <main className="flex-1">
        <div className="w-full px-4 md:px-8 pt-8 flex justify-end">
          <AccountLogoutButton />
        </div>

        <div className="w-full px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          
          <AccountSidebar />

          <div className="flex-1 w-full">
            <AccountPayments />
          </div>
          
        </div>
      </main>

      
    </div>
  );
}
