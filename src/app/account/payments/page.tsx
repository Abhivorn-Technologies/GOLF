import React from 'react';


import AccountSidebar from '@/components/AccountSidebar';
import AccountPayments from '@/components/AccountPayments';

export default function PaymentsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      
      
      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-[64px] pt-[32px]">
        </div>

        <div className="max-w-[1280px] mx-auto px-[64px] py-[32px] flex flex-col md:flex-row gap-[48px] items-start">
          
          <AccountSidebar />

          <div className="flex-1 w-full">
            <AccountPayments />
          </div>
          
        </div>
      </main>

      
    </div>
  );
}
