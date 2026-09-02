import React from 'react';
import { Package, ShoppingCart, DollarSign, ArrowUpRight, Users, AlertTriangle } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Link from 'next/link';
import Image from 'next/image';
import RevenueChart from '@/components/admin/RevenueChart';

export default async function AdminDashboardPage() {
  let totalOrders = 0, totalProducts = 0, totalCustomers = 0;
  let recentOrders: any[] = [], topProducts: any[] = [], lowStockProducts: any[] = [];
  let totalRevenue = 0;
  let revenueChartData: { label: string; value: number }[] = [];

  try {
    await dbConnect();
    const [ordersCount, productsCount, customersCount, latestOrders, latestProducts, allOrders, lowStock] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Product.find({}).sort({ createdAt: -1 }).limit(3).lean(),
      Order.find({ paymentStatus: 'paid' }).select('totalAmount createdAt').lean(),
      Product.find({ stockCount: { $lte: 5 }, inStock: true }).sort({ stockCount: 1 }).limit(8).lean()
    ]);
    totalOrders = ordersCount;
    totalProducts = productsCount;
    totalCustomers = customersCount;
    recentOrders = latestOrders;
    topProducts = latestProducts;
    lowStockProducts = lowStock;
    totalRevenue = (allOrders as any[]).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const today = new Date();
    revenueChartData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);
      const value = (allOrders as any[])
        .filter(o => { const c = new Date(o.createdAt); return c >= start && c <= end; })
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      return { label: dayLabel, value };
    });
  } catch (error) {
    console.error('DB Connection failed:', error);
  }

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign },
    { title: 'Total Orders',  value: totalOrders.toString(),    icon: ShoppingCart },
    { title: 'Products',      value: totalProducts.toString(),  icon: Package },
    { title: 'Customers',     value: totalCustomers.toString(), icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-gray-100"><Icon className="w-6 h-6 text-black" /></div>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <div className="mt-4">
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Revenue — Last 7 Days</h2>
            <p className="text-sm text-gray-500">Total: ₹{revenueChartData.reduce((s, d) => s + d.value, 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <RevenueChart data={revenueChartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
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
                    <td className="py-4 font-medium text-gray-900">
                      <Link href={`/admin/orders/${order._id}`} className="hover:underline">
                        #{order._id.toString().slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-4 text-gray-600">{order.shippingAddress?.name || 'Guest'}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-800">
                        {(order.shippingStatus || 'Processing').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-gray-900 text-right">₹{(order.totalAmount ?? 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Latest Products</h2>
              <Link href="/admin/products" className="text-black text-sm font-bold hover:text-gray-600">View All</Link>
            </div>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No products.</div>
              ) : topProducts.map((product: any) => (
                <div key={product._id.toString()} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-200 shrink-0">
                    {product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('/')) ? (
                      <Image src={product.images[0]} alt={product.title || 'Product'} fill className="object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 line-clamp-1 text-sm">{product.title}</div>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>
                  <div className="font-bold text-gray-900 text-sm shrink-0">₹{product.price.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>

          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-amber-900">Low Stock Alert</h2>
              </div>
              <div className="flex flex-col gap-3">
                {lowStockProducts.map((product: any) => (
                  <div key={product._id.toString()} className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-amber-900 line-clamp-1">{product.title}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${product.stockCount === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {product.stockCount === 0 ? 'Out of Stock' : `${product.stockCount} left`}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/admin/products" className="mt-4 block text-center text-xs font-bold text-amber-700 hover:text-amber-900 underline">
                Manage Inventory →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
