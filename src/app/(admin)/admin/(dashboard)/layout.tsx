import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { verifyAdminSession } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifyAdminSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="h-screen bg-[#FAFAFA] flex font-sans selection:bg-black selection:text-white text-gray-900">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="w-[120px] h-[30px] relative">
            {/* You could add a mobile logo here */}
            <span className="font-bold text-gray-900">GOLFOY Admin</span>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 xl:p-8">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
