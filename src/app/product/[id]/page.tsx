import React from 'react';
import { notFound } from 'next/navigation';


import ProductDetails from '@/components/ProductDetails';
import { getProductById } from '@/data/products';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product = null;

  try {
    await dbConnect();
    
    // Check if it's a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      const doc = await Product.findById(id).lean() as any;
      if (doc) {
        product = {
          id: doc._id.toString(),
          name: doc.title,
          brand: doc.brand,
          price: `₹${doc.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          image: doc.images && doc.images.length > 0 ? doc.images[0] : 'placeholder.png',
          images: doc.images || [],
          category: doc.category,
          style: doc.style,
          gender: doc.gender,
          type: doc.type,
          loft: doc.loft,
          size: doc.size,
          description: doc.description,
          features: doc.features,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch product from DB", error);
  }

  // Fallback to static mock data if not found in DB
  if (!product) {
    product = getProductById(id);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      
      
      <main className="flex-1">
        <ProductDetails product={product} />
      </main>

      
    </div>
  );
}
