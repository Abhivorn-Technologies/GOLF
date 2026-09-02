import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Image from 'next/image';
import QuickAddOverlay from "@/app/(storefront)/product/_components/QuickAddOverlay";
import WishlistButton from '@/components/WishlistButton';

export default async function NewArrivals() {
  let latestProducts: any[] = [];
  try {
    await dbConnect();
    let products = await Product.find({ isNewArrival: true, inStock: true }).sort({ createdAt: -1 }).limit(4).lean();
    
    // Fallback: if admin hasn't marked any products as new arrivals, just show the latest 4 products
    if (products.length === 0) {
      products = await Product.find({ inStock: true }).sort({ createdAt: -1 }).limit(4).lean();
    }
    latestProducts = products.map((p: any) => ({
      id: p._id.toString(),
      brand: p.brand,
      name: p.title,
      price: `₹${p.price.toLocaleString('en-IN')}`,
      image: p.images?.[0] || 'placeholder.png'
    }));
  } catch (error) {
    console.error('Failed to fetch new arrivals', error);
  }

  return (
    <section className="w-full py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase mb-4">New Arrivals</h2>
          <div className="w-12 h-1 bg-green-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative h-64 w-full bg-zinc-100 rounded-xl mb-4 overflow-hidden block">
                <WishlistButton productId={product.id} />
                <Link href={`/product/${product.slug || product.id}`} className="w-full h-full block">
                  <Image src={product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `/images/${product.image}`} alt={product.name} fill className="object-contain p-4 mix-blend-multiply" />
                </Link>
                <div suppressHydrationWarning>
                  <QuickAddOverlay product={product} />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand}</span>
                <Link href={`/product/${product.slug || product.id}`} className="text-lg font-bold text-zinc-900 hover:text-green-600 transition-colors leading-tight mb-2">
                  {product.name}
                </Link>
                <span className="text-sm font-semibold text-zinc-600">{product.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/new-arrivals" className="px-8 py-3 rounded-full border-2 border-black text-black font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
