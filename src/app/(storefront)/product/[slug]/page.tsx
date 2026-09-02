import React from 'react';
import { notFound } from 'next/navigation';


import ProductDetails from "@/app/(storefront)/product/_components/ProductDetails";
import { getProductById, getProductsByCategory } from '@/data/products';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

import type { Metadata, ResolvingMetadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  
  let doc = await Product.findOne({ slug }).lean() as any;
  if (!doc && mongoose.Types.ObjectId.isValid(slug)) {
    doc = await Product.findById(slug).lean() as any;
  }
  
  if (!doc) {
    const staticProd = getProductById(slug);
    if (staticProd) {
      return { title: staticProd.name, description: staticProd.description };
    }
    return { title: 'Product Not Found' };
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      images: doc.images?.length ? [{ url: doc.images[0].startsWith('http') ? doc.images[0] : `/images/${doc.images[0]}` }] : [],
    },
  };
}


export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    await dbConnect();
    
    // First try by slug
    let doc = await Product.findOne({ slug }).lean() as any;
    
    // Fallback: Check if it's a valid MongoDB ObjectId
    if (!doc && mongoose.Types.ObjectId.isValid(slug)) {
      doc = await Product.findById(slug).lean() as any;
    }
    
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

        const relatedDocs = await Product.find({ 
          category: doc.category, 
          _id: { $ne: doc._id } 
        }).limit(4).lean() as any[];

        relatedProducts = relatedDocs.map(rDoc => ({
          id: rDoc._id.toString(),
          name: rDoc.title,
          brand: rDoc.brand,
          price: `₹${rDoc.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          image: rDoc.images && rDoc.images.length > 0 ? rDoc.images[0] : 'placeholder.png',
          category: rDoc.category,
          slug: rDoc.slug
        }));
    }
  } catch (error) {
    console.error("Failed to fetch product from DB", error);
  }

  // Fallback to static mock data if not found in DB
  if (!product) {
    product = getProductById(slug);
    if (product) {
      relatedProducts = getProductsByCategory(product.category)
        .filter(p => p.id !== product.id)
        .slice(0, 4);
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      
      
      <main className="flex-1">
        <ProductDetails product={product} relatedProducts={relatedProducts} />
      </main>

      
    </div>
  );
}
