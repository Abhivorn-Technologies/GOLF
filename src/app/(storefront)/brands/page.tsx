import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';
import { ArrowRight } from 'lucide-react';

function resolveImg(src: string) {
  if (!src) return '/images/golf.png';
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) return src;
  return `/images/${src}`;
}

export default async function BrandsPage() {
  let brands: any[] = [];
  
  try {
    await dbConnect();
    // Fetch active brands sorted by display order
    brands = await Brand.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
  } catch (err) {
    console.error("Local DB connection failed", err);
  }

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-4">
            Shop By Brand
          </h1>
          <div className="w-16 h-1 bg-green-600 rounded-full mb-6"></div>
          <p className="text-gray-500 font-medium max-w-2xl">Discover top-tier equipment from the most trusted names in golf. Select a brand below to view their complete collection.</p>
        </div>

        {brands.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Brands Available</h3>
            <p className="text-gray-500">We are currently updating our brand catalog. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <Link 
                key={brand._id.toString()}
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="group bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col items-center justify-center p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all h-[200px]"
              >
                <div className="w-full h-[100px] relative mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={resolveImg(brand.imageUrl || '')} 
                    alt={brand.name} 
                    className="w-full h-full object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-green-600 transition-colors">
                  View Products <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
