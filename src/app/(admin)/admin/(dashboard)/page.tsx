import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  AlertTriangle,
  Clock,
  RotateCcw,
  Truck
} from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Link from 'next/link';
import RevenueTrendCard from '@/components/admin/RevenueTrendCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let totalOrders = 0, totalProducts = 0, totalCustomers = 0;
  let recentOrders: any[] = [], latestProducts: any[] = [], lowStockProducts: any[] = [];
  let totalRevenue = 0, paidRevenue = 0;
  let pendingOrdersCount = 0, shippedOrdersCount = 0, pendingReturnsCount = 0;
  let serializedValidOrders: any[] = [];
  
  let revenueGrowth = 0, ordersGrowth = 0, productsGrowth = 0, customersGrowth = 0;

  try {
    await dbConnect();
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      ordersCount, 
      productsCount, 
      customersCount, 
      recentOrdersList, 
      recentProductsList,
      allValidOrders,
      allProductsList,
      
      // Order Status Counts
      processingCount,
      shippedCount,
      returnsCount,

      // Growth Window Queries
      thisPeriodOrders,
      lastPeriodOrders,
      thisPeriodProductsCount,
      lastPeriodProductsCount,
      thisPeriodCustomersCount,
      lastPeriodCustomersCount
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Order.find({}).sort({ createdAt: -1 }).limit(6).lean(),
      Product.find({}).sort({ createdAt: -1 }).limit(4).lean(),
      
      // Fetch all non-cancelled orders for revenue calculations
      Order.find({ shippingStatus: { $ne: 'cancelled' } }).select('totalAmount paymentStatus createdAt').lean(),
      
      // Fetch all products to accurately calculate variant stock
      Product.find({}).select('title brand price stockCount variants images inStock').lean(),
      
      // Status Counts
      Order.countDocuments({ shippingStatus: 'processing' }),
      Order.countDocuments({ shippingStatus: 'shipped' }),
      Order.countDocuments({ returnStatus: 'requested' }),

      // Growth comparisons
      Order.find({ shippingStatus: { $ne: 'cancelled' }, createdAt: { $gte: thirtyDaysAgo } }).select('totalAmount').lean(),
      Order.find({ shippingStatus: { $ne: 'cancelled' }, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }).select('totalAmount').lean(),
      Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Product.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })
    ]);
    
    totalOrders = ordersCount;
    totalProducts = productsCount;
    totalCustomers = customersCount;
    recentOrders = recentOrdersList;
    latestProducts = recentProductsList;
    
    pendingOrdersCount = processingCount;
    shippedOrdersCount = shippedCount;
    pendingReturnsCount = returnsCount;

    // Serialize valid orders for client component
    serializedValidOrders = (allValidOrders as any[]).map(o => ({
      totalAmount: Number(o.totalAmount) || 0,
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
    }));

    // Calculate Total Revenue & Paid Revenue from non-cancelled orders
    totalRevenue = (allValidOrders as any[]).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    paidRevenue = (allValidOrders as any[])
      .filter(o => o.paymentStatus === 'paid' || o.shippingStatus === 'delivered')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
    if (paidRevenue === 0 && totalRevenue > 0) {
      paidRevenue = totalRevenue;
    }

    // Filter Low Stock Products across both variant stock and root stock
    lowStockProducts = (allProductsList as any[])
      .map(p => {
        const calculatedStock = p.variants && p.variants.length > 0 
          ? p.variants.reduce((sum: number, v: any) => sum + (Number(v.stockCount) || 0), 0)
          : (Number(p.stockCount) || 0);
        return { ...p, calculatedStock };
      })
      .filter(p => p.calculatedStock <= 5 && p.inStock)
      .sort((a, b) => a.calculatedStock - b.calculatedStock)
      .slice(0, 8);

    // Growth Metrics Calculations
    const thisPeriodRev = (thisPeriodOrders as any[]).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const lastPeriodRev = (lastPeriodOrders as any[]).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    revenueGrowth = lastPeriodRev > 0 ? ((thisPeriodRev - lastPeriodRev) / lastPeriodRev) * 100 : (thisPeriodRev > 0 ? 100 : 0);
    ordersGrowth = lastPeriodOrders.length > 0 ? ((thisPeriodOrders.length - lastPeriodOrders.length) / lastPeriodOrders.length) * 100 : (thisPeriodOrders.length > 0 ? 100 : 0);
    productsGrowth = lastPeriodProductsCount > 0 ? ((thisPeriodProductsCount - lastPeriodProductsCount) / lastPeriodProductsCount) * 100 : (thisPeriodProductsCount > 0 ? 100 : 0);
    customersGrowth = lastPeriodCustomersCount > 0 ? ((thisPeriodCustomersCount - lastPeriodCustomersCount) / lastPeriodCustomersCount) * 100 : (thisPeriodCustomersCount > 0 ? 100 : 0);

  } catch (error) {
    console.error('DB Connection or Dashboard fetch failed:', error);
  }

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, subtitle: `Paid: ₹${paidRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, icon: DollarSign, growth: revenueGrowth },
    { title: 'Total Orders',  value: totalOrders.toString(), subtitle: `${pendingOrdersCount} pending dispatch`, icon: ShoppingCart, growth: ordersGrowth },
    { title: 'Active Products', value: totalProducts.toString(), subtitle: `${lowStockProducts.length} low stock items`, icon: Package, growth: productsGrowth },
    { title: 'Registered Customers', value: totalCustomers.toString(), subtitle: 'Total buyers', icon: Users, growth: customersGrowth },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time sales performance, fulfillment statuses, and inventory insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/products/new" 
            className="bg-[#006747] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#005238] transition-colors shadow-sm"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.growth >= 0;
          return (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100"><Icon className="w-5 h-5 text-gray-900" /></div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{Math.abs(stat.growth).toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actionable Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          href="/admin/orders?status=processing" 
          className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between hover:bg-amber-100/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl"><Clock className="w-5 h-5" /></div>
            <div>
              <div className="text-sm font-bold text-amber-950">Pending Dispatch</div>
              <div className="text-xs text-amber-700">{pendingOrdersCount} orders ready to pack</div>
            </div>
          </div>
          <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-1 rounded-full">{pendingOrdersCount}</span>
        </Link>

        <Link 
          href="/admin/returns" 
          className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 flex items-center justify-between hover:bg-orange-100/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-800 rounded-xl"><RotateCcw className="w-5 h-5" /></div>
            <div>
              <div className="text-sm font-bold text-orange-950">Return Requests</div>
              <div className="text-xs text-orange-700">{pendingReturnsCount} customer requests pending</div>
            </div>
          </div>
          <span className="text-xs font-bold bg-orange-200 text-orange-900 px-2 py-1 rounded-full">{pendingReturnsCount}</span>
        </Link>

        <Link 
          href="/admin/orders?status=shipped" 
          className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between hover:bg-blue-100/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl"><Truck className="w-5 h-5" /></div>
            <div>
              <div className="text-sm font-bold text-blue-950">In Transit</div>
              <div className="text-xs text-blue-700">{shippedOrdersCount} orders currently out for delivery</div>
            </div>
          </div>
          <span className="text-xs font-bold bg-blue-200 text-blue-900 px-2 py-1 rounded-full">{shippedOrdersCount}</span>
        </Link>
      </div>

      {/* Interactive Revenue Trend Card with Calendar Filters */}
      <RevenueTrendCard allOrders={serializedValidOrders} />

      {/* Recent Orders & Inventory Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <p className="text-xs text-gray-500">Latest customer purchases</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-[#006747] hover:underline">View All Orders →</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-400 text-sm">No orders recorded yet.</td></tr>
                ) : recentOrders.map((order: any) => (
                  <tr key={order._id.toString()} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 font-bold text-gray-900">
                      <Link href={`/admin/orders/${order._id}`} className="hover:text-[#006747] transition-colors">
                        #{order._id.toString().slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-3.5 text-gray-600">
                      <div className="font-medium text-gray-900 text-sm">{order.shippingAddress?.name || 'Guest'}</div>
                      <div className="text-xs text-gray-400">{order.customerEmail}</div>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                        order.shippingStatus === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                        order.shippingStatus === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        order.shippingStatus === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.shippingStatus || 'processing'}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-gray-900 text-right">
                      ₹{(order.totalAmount ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Column: Latest Products & Low Stock Warnings */}
        <div className="flex flex-col gap-6">
          {/* Low Stock Warning Box */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h2 className="text-base font-bold text-amber-950">Low Stock Alert</h2>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">{lowStockProducts.length} Items</span>
              </div>
              
              <div className="flex flex-col gap-2.5">
                {lowStockProducts.map((product: any) => (
                  <div key={product._id.toString()} className="flex items-center justify-between gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-100">
                    <Link href={`/admin/products/${product._id.toString()}`} className="text-xs font-semibold text-gray-900 line-clamp-1 hover:text-[#006747]">
                      {product.title}
                    </Link>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      product.calculatedStock === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {product.calculatedStock === 0 ? 'Out of Stock' : `${product.calculatedStock} left`}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/admin/products" className="mt-3 block text-center text-xs font-bold text-amber-800 hover:text-amber-950 underline">
                Manage All Stock →
              </Link>
            </div>
          )}

          {/* Latest Products Added */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-gray-900">Recently Added Products</h2>
              <Link href="/admin/products" className="text-xs font-bold text-[#006747] hover:underline">View All</Link>
            </div>
            <div className="space-y-3.5">
              {latestProducts.length === 0 ? (
                <div className="text-center text-gray-400 py-4 text-xs">No products in catalog.</div>
              ) : latestProducts.map((product: any) => (
                <div key={product._id.toString()} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-200 shrink-0">
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0].startsWith('data:') || product.images[0].startsWith('http') || product.images[0].startsWith('/') ? product.images[0] : `/images/${product.images[0]}`} 
                        alt={product.title || 'Product'} 
                        className="w-full h-full object-contain p-1 mix-blend-multiply" 
                      />
                    ) : (
                      <Package className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 line-clamp-1 text-xs">{product.title}</div>
                    <p className="text-[11px] text-gray-400">{product.brand}</p>
                  </div>
                  <div className="font-bold text-gray-900 text-xs shrink-0">₹{product.price.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
