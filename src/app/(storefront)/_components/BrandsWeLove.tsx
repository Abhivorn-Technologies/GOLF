import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';

function resolveImg(src: string) {
  if (!src) return '/images/golf.png';
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) return src;
  return `/images/${src}`;
}

interface BrandsWeLoveProps {
  category?: string;
  brands?: any[];
}

export default async function BrandsWeLove({ category, brands: prefetchedBrands }: BrandsWeLoveProps) {
  let brands: any[] = [];
  
  if (prefetchedBrands && prefetchedBrands.length > 0) {
    // Use pre-fetched data (from homepage parallel fetch)
    brands = prefetchedBrands;
  } else {
    // Self-fetch (used on category pages)
    try {
      await dbConnect();
      const query: any = { isActive: true };
      if (category) {
        query.categories = category;
      }
      const rawBrands = await Brand.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();
      brands = rawBrands.map((b: any) => ({
        _id: b._id.toString(),
        name: b.name,
        imageUrl: b.imageUrl,
        linkUrl: b.linkUrl,
        categories: b.categories,
      }));
    } catch (err) {
      console.error("Local DB connection failed", err);
    }
  }

  // Hide the section if no brands have been uploaded by admin
  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 bg-[#f8f9fa] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        
        <div className="relative mb-12">
          {/* Centered Heading */}
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight uppercase mb-4 text-center">Brands We Love</h2>
            <div className="w-16 h-1 bg-green-600 rounded-full mb-6"></div>
            <p className="text-gray-500 text-center max-w-2xl px-4">Discover top-tier equipment from the most trusted names in golf.</p>
          </div>

          {/* View All Arrow (Positioned above the last image grid column on desktop) */}
          <div className="absolute right-0 top-0 hidden md:flex items-center h-[40px]">
            <Link 
              href="/brands"
              className="flex items-center hover:text-green-600 transition-colors cursor-pointer group"
            >
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-xs mr-2 group-hover:text-green-600 transition-colors">View All Brands</span>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {brands.slice(0, 6).map((brand) => {
            const isValidUrl = brand.linkUrl && brand.linkUrl.length > 1 && (brand.linkUrl.startsWith('/') || brand.linkUrl.startsWith('http'));
            const targetHref = isValidUrl ? brand.linkUrl : `/products?brand=${encodeURIComponent(brand.name)}`;
            
            return (
            <Link 
              href={targetHref}
              key={brand._id.toString()} 
              className="w-full h-[120px] lg:h-[140px] bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-4 lg:p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={resolveImg(brand.imageUrl || '')}
                  alt={brand.name}
                  className="w-full h-full object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </Link>
          )})}
        </div>
        
        {/* Mobile View All Button (shows below grid on small screens) */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link 
            href="/brands"
            className="flex items-center text-zinc-900 font-bold uppercase tracking-wider text-sm group"
          >
            <span className="mr-2">View All Brands</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
        
      </div>
    </section>
  );
}
