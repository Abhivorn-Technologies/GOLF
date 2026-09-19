import React from 'react';
import { Search, Mail, Phone, ShoppingCart } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Pagination from '@/components/admin/Pagination';

async function getCustomers(page: number, limit: number) {
  try {
    await dbConnect();
    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments({ role: { $ne: 'admin' } })
    ]);
    
    // Get order counts for each user
    const customersWithStats = await Promise.all(users.map(async (user: any) => {
      const orders = await Order.find({ userId: user._id }).lean();
      const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
      return {
        ...user,
        orderCount: orders.length,
        totalSpent
      };
    }));
    
    return { customers: customersWithStats, totalCount };
  } catch (error) {
    console.error("Failed to fetch customers", error);
    return { customers: [], totalCount: 0 };
  }
}

export default async function CustomersPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = 10;

  const { customers, totalCount } = await getCustomers(page, limit);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer accounts and view their purchase history.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search customers by name or email..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500 bg-white">
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Contact</th>
                <th className="py-4 px-6 font-medium">Newsletter</th>
                <th className="py-4 px-6 font-medium">Joined Date</th>
                <th className="py-4 px-6 font-medium">Orders</th>
                <th className="py-4 px-6 font-medium">Total Spent</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id.toString()} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 border border-gray-200">
                          {customer.name?.charAt(0).toUpperCase() || customer.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-900">{customer.name || 'Unknown Name'}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Mail className="w-3.5 h-3.5" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {customer.newsletterSubscribed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Subscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          Not Subscribed
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{customer.orderCount}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      ₹{customer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
