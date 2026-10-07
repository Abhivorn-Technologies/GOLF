import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';
import ScrollReveal from '@/components/ScrollReveal';

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
    brands = prefetchedBrands;
  } else {
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

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-20 bg-[#f8f9fa] border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="relative mb-14">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-3">
                Authorized Retailer
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight uppercase mb-3 text-center">
                Brands We Love
              </h2>
              <div className="w-16 h-1 bg-green-600 rounded-full mb-4"></div>
              <p className="text-gray-500 text-center max-w-2xl px-4 text-sm md:text-base">
                Discover top-tier equipment and apparel from the most trusted names in championship golf.
              </p>
            </div>

            {/* Desktop View All Link */}
            <div className="absolute right-0 top-0 hidden md:flex items-center h-[40px]">
              <Link 
                href="/brands" 
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-green-600 transition-colors group cursor-pointer"
              >
                <span>View All Brands</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
        
        {/* Brand Logos Grid with Staggered Scroll Reveal & Dynamic Hover */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {brands.slice(0, 6).map((brand, idx) => {
            const isValidUrl = brand.linkUrl && brand.linkUrl.length > 1 && (brand.linkUrl.startsWith('/') || brand.linkUrl.startsWith('http'));
            const targetHref = isValidUrl ? brand.linkUrl : `/products?brand=${encodeURIComponent(brand.name)}`;
            
            return (
              <ScrollReveal key={brand._id.toString()} animation="fade-up" delay={idx * 80} duration={600}>
                <Link 
                  href={targetHref}
                  className="w-full h-[120px] lg:h-[140px] bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-4 lg:p-6 transition-all duration-300 hover:shadow-[0_15px_30px_-5px_rgba(0,103,71,0.1),0_8px_16px_-4px_rgba(0,0,0,0.04)] hover:border-emerald-500/40 hover:-translate-y-2 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={resolveImg(brand.imageUrl || '')}
                      alt={brand.name}
                      className="w-full h-full object-contain p-2 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300 ease-out"
                    />
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
        
        {/* Mobile View All Button */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="mt-10 flex justify-center md:hidden">
            <Link 
              href="/brands"
              className="inline-flex items-center gap-2 text-zinc-900 font-bold uppercase tracking-wider text-xs border border-gray-300 rounded-full px-6 py-3 hover:bg-zinc-900 hover:text-white transition-all group"
            >
              <span>View All Brands</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </ScrollReveal>
        
      </div>
    </section>
  );
}
