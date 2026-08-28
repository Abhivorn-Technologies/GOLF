import React from 'react';
import Link from 'next/link';


// Use a simpler approach to fetch products in search since it's a server component
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

async function getSearchResults(query: string) {
  if (!query) return [];
  await dbConnect();
  
  // Case-insensitive regex search in title and description
  const searchRegex = new RegExp(query, 'i');
  
  const products = await Product.find({
    $or: [
      { title: searchRegex },
      { description: searchRegex },
      { brand: searchRegex }
    ]
  }).sort({ createdAt: -1 }).lean();
  
  return products as any[];
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || '';
  const products = await getSearchResults(query);

  return (
    <main className="min-h-screen bg-white">
      
      <div className="max-w-[1280px] mx-auto px-[64px] py-[64px] min-h-[60vh]">
        <h1 className="text-3xl font-serif text-[#1b1c1c] mb-[32px]">
          {query ? `Search Results for "${query}"` : "Search Products"}
        </h1>
        
        {query && products.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl mb-4">No products found matching "{query}".</p>
            <p>Try checking your spelling or using more general terms.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[32px]">
          {products.map((product) => (
            <div key={product._id} className="bg-white border border-[#c1c9bf] rounded-[16px] p-[24px] hover:shadow-md transition-shadow group flex flex-col h-full">
              <Link href={`/product/${product.slug || product._id}`} className="w-full aspect-[4/3] bg-[#fbf9f9] rounded-[8px] mb-[24px] overflow-hidden relative flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0].startsWith('http') ? product.images[0] : `/images/${product.images[0]}`} alt={product.title} className="w-full h-full object-contain p-4 mix-blend-multiply" />
                  ) : (
                    <span className="text-[#717b71] font-serif italic">No image</span>
                  )}
                </div>
              </Link>
              
              <div className="flex flex-col flex-grow">
                <Link href={`/product/${product.slug || product._id}`} className="text-[20px] font-serif font-semibold text-[#1b1c1c] group-hover:text-green-700 transition-colors leading-tight mb-[8px]">
                  {product.title}
                </Link>
                <span className="text-[12px] font-medium text-[#717b71] uppercase tracking-[1.2px] mb-[16px] block">{product.brand}</span>
              </div>
              
              <div className="pt-[16px] border-t border-[#c1c9bf] flex justify-between items-center mt-auto">
                <span className="text-[24px] font-semibold text-[#1b1c1c]">₹{product.price?.toLocaleString()}</span>
                <Link href={`/product/${product.slug || product._id}`} className="w-[48px] h-[48px] rounded-full border border-[#c1c9bf] flex items-center justify-center hover:bg-[#003319] hover:border-[#003319] hover:text-white text-[#1b1c1c] transition-colors group-hover:bg-[#003319] group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
