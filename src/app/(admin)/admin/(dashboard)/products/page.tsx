import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import Pagination from '@/components/admin/Pagination';

async function getProducts(page: number, limit: number) {
  try {
    await dbConnect();
    const skip = (page - 1) * limit;
    const [products, totalCount] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments({})
    ]);
    return { products: products as any[], totalCount };
  } catch (error) {
    console.error("Failed to fetch products", error);
    return { products: [], totalCount: 0 };
  }
}

export default async function ProductsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = 10;

  const { products, totalCount } = await getProducts(page, limit);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 mt-1">Manage your store's inventory and products.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex gap-4 bg-white items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50/50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all text-sm outline-none"
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-50 text-xs uppercase tracking-wider text-gray-400 bg-white font-semibold">
                <th className="py-5 px-8">Product</th>
                <th className="py-5 px-8">Category</th>
                <th className="py-5 px-8">Brand</th>
                <th className="py-5 px-8">Price</th>
                <th className="py-5 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400 font-medium">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id.toString()} className="border-b border-gray-50/50 hover:bg-gray-50/30 transition-colors group">
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden relative flex-shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                          {product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('/')) ? (
                            <Image 
                              src={product.images[0]} 
                              alt={product.title || 'Product Image'}
                              fill
                              className="object-cover mix-blend-multiply"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] uppercase font-bold tracking-wider">No img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-1">{product.title || 'Untitled Product'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-8 text-gray-500 capitalize font-medium">{product.category || product.type || '-'}</td>
                    <td className="py-4 px-8 text-gray-500 font-medium">{product.brand}</td>
                    <td className="py-4 px-8 font-bold text-gray-900">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-8">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/${product._id.toString()}`} className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <DeleteProductButton productId={product._id.toString()} />
                      </div>
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
