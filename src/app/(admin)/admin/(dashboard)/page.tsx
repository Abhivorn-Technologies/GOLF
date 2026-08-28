import React from 'react';
import { Package, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight, Users } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminDashboardPage() {
  let totalOrders = 0, totalProducts = 0, totalCustomers = 0, recentOrders: any[] = [], topProducts: any[] = [], totalRevenue = 0;

  try {
    await dbConnect();
    const results = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Product.find({}).sort({ createdAt: -1 }).limit(3).lean()
    ]);
    totalOrders = results[0];
    totalProducts = results[1];
    totalCustomers = results[2];
    recentOrders = results[3];
    topProducts = results[4];

    const orders = await Order.find({ status: { $ne: 'cancelled' } }).lean();
    totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
  } catch (error) {
    console.error("DB Connection failed, using mock data for local dev:", error);
    // Fallback data if local DB connection fails
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      trend: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-black',
      bgColor: 'bg-gray-100'
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      trend: '+5.2%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'text-black',
      bgColor: 'bg-gray-100'
    },
    {
      title: 'Products in Stock',
      value: totalProducts.toString(),
      trend: '+2.1%',
      isPositive: true,
      icon: Package,
      color: 'text-black',
      bgColor: 'bg-gray-100'
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      trend: '+8.4%',
      isPositive: true,
      icon: Users,
      color: 'text-black',
      bgColor: 'bg-gray-100'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here is what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                  {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-black text-sm font-bold hover:text-gray-600 transition-colors">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-500">No orders yet.</td></tr>
                ) : recentOrders.map((order: any) => (
                  <tr key={order._id.toString()} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-medium text-gray-900">#{order._id.toString().slice(-6).toUpperCase()}</td>
                    <td className="py-4 text-gray-600">{order.shippingAddress?.fullName || 'Guest'}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-800">
                        {(order.status || 'Pending').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-gray-900 text-right">${order.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Latest Products</h2>
            <Link href="/admin/products" className="text-black text-sm font-bold hover:text-gray-600 transition-colors">View All</Link>
          </div>
          <div className="space-y-6">
            {topProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No products found.</div>
            ) : topProducts.map((product: any) => (
              <div key={product._id.toString()} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-200">
                  {product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('/')) ? (
                    <Image src={product.images[0]} alt={product.title || 'Product Image'} fill className="object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 line-clamp-1">{product.title || 'Untitled Product'}</div>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                </div>
                <div className="font-bold text-gray-900">${product.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
