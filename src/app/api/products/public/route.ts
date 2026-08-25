import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brands = searchParams.getAll('brand');
    const styles = searchParams.getAll('style');
    const genders = searchParams.getAll('gender');

    const saleOnly = searchParams.get('sale');

    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (saleOnly === 'true') {
      // Find where compareAtPrice exists and is strictly greater than price
      query.$expr = { $gt: ["$compareAtPrice", "$price"] };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (brands.length > 0) {
      // Create case-insensitive regex for brands to match frontend behavior
      query.brand = { $in: brands.map(b => new RegExp('^' + b + '$', 'i')) };
    }

    if (styles.length > 0) {
      query.style = { $in: styles.map(s => new RegExp('^' + s + '$', 'i')) };
    }

    if (genders.length > 0) {
      query.gender = { $in: genders.map(g => new RegExp('^' + g + '$', 'i')) };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    // Transform MongoDB _id to string id to match existing ProductType format
    const transformedProducts = products.map((p) => {
      const doc = p.toObject();
      return {
        id: doc._id.toString(),
        name: doc.title,
        brand: doc.brand,
        price: `₹${doc.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        compareAtPriceStr: doc.compareAtPrice ? `₹${doc.compareAtPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : null,
        numericPrice: doc.price,
        numericCompareAtPrice: doc.compareAtPrice || null,
        image: doc.images && doc.images.length > 0 ? doc.images[0] : 'placeholder.png',
        category: doc.category,
        style: doc.style,
        gender: doc.gender,
        type: doc.type,
        loft: doc.loft,
        size: doc.size,
        description: doc.description,
        features: doc.features,
      };
    });

    return NextResponse.json({ success: true, data: transformedProducts });
  } catch (error: any) {
    console.error('Error fetching public products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
