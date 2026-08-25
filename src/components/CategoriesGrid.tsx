import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function CategoriesGrid() {
  let categories: { name: string, image: string | null }[] = [];
  try {
    await dbConnect();
    // Get unique categories from the database
    const distinctCategories = await Product.distinct('category');
    
    // For each category, find the latest product to use its image, ignoring placeholders
    categories = await Promise.all(distinctCategories.map(async (cat: string) => {
      const latestProduct = await Product.findOne({ 
        category: cat, 
        images: { $exists: true, $not: { $size: 0 } },
        "images.0": { $ne: "placeholder.png" } 
      })
        .sort({ createdAt: -1 })
        .lean();
        
      return {
        name: cat,
        image: latestProduct?.images?.[0] || null
      };
    }));
  } catch (err) {
    console.error("Failed to fetch categories", err);
    // Fallback if DB fails
    const fallbacks = ['Clubs', 'Shoes', 'Apparel', 'Accessories', 'Bags', 'Balls'];
    categories = fallbacks.map(f => ({ name: f, image: null }));
  }

  // Predefined subtitles for common categories for better UI, otherwise generic
  const getSubtitle = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'clubs': return 'Drivers, Irons & Putters';
      case 'shoes': return 'Performance & Comfort';
      case 'apparel': return 'Shirts, Pants & More';
      case 'accessories': return 'Rangefinders & Tees';
      case 'bags': return 'Cart & Stand Bags';
      case 'balls': return 'Tour & Distance Balls';
      default: return `Explore ${cat}`;
    }
  };

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10 max-w-2xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight uppercase mb-4">All Categories</h2>
          <div className="w-12 h-1 bg-green-600 rounded-full mb-4"></div>
          <p className="text-zinc-600 text-xl font-medium">Shop directly from our active inventory.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <Link key={idx} href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} className={`group relative h-[360px] rounded-2xl overflow-hidden bg-zinc-100 flex flex-col justify-end p-6 border border-gray-200 transition-all duration-300 hover:border-green-500 hover:shadow-lg col-span-1 md:col-span-1 lg:col-span-1`}>
              
              {/* Category Icon / Placeholder */}
              <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-zinc-400 group-hover:text-green-600 transition-colors z-10">
                <span className="font-bold text-lg">{category.name.charAt(0).toUpperCase()}</span>
              </div>

              {/* Background Image Placeholder or Real Image */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent transition-opacity duration-300 z-10"></div>
              {category.image && (
                <div className="absolute inset-0 z-0">
                  <img src={category.image.startsWith('http') || category.image.startsWith('/') ? category.image : `/images/${category.image}`} alt={category.name} className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}

              <div className="relative z-20 flex justify-between items-end bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/50 group-hover:bg-white transition-colors">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-tight mb-1 group-hover:text-green-600 transition-colors">
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium">{getSubtitle(category.name)}</p>
                </div>
                <div className="bg-zinc-100 p-2 rounded-full text-zinc-400 group-hover:bg-green-600 group-hover:text-white transition-all transform group-hover:rotate-12 group-hover:scale-110 shadow-sm">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
