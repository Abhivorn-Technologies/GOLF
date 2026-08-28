import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10) || 1;
    const limit = parseInt(searchParams.get('limit') || '12', 10) || 12;
    const skip = (page - 1) * limit;

    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brands = searchParams.getAll('brand').filter(b => b.trim() !== '');
    const styles = searchParams.getAll('style').filter(s => s.trim() !== '');
    const genders = searchParams.getAll('gender').filter(g => g.trim() !== '');

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

    if (searchParams.get('newArrivals') === 'true') {
      query.isNewArrival = true;
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

    const staticFields = ['category', 'minPrice', 'maxPrice', 'brand', 'style', 'gender', 'sale', 'newArrivals', 'type', 'loft', 'size', 'page', 'limit'];
    
    // Explicitly handle fields that might be capitalized in searchParams but are lowercase in DB
    const lowerCaseSearchKeys = Array.from(searchParams.keys()).map(k => k.toLowerCase());
    
    ['type', 'loft', 'size'].forEach(field => {
      // Find all keys that match case-insensitively
      const matchingKeys = Array.from(searchParams.keys()).filter(k => k.toLowerCase() === field);
      let values: string[] = [];
      matchingKeys.forEach(k => {
        values = values.concat(searchParams.getAll(k).filter(v => v.trim() !== ''));
      });
      if (values.length > 0) {
        query[field] = { $in: values.map(v => new RegExp('^' + v + '$', 'i')) };
      }
    });

    // Dynamically parse custom attributes (stored in the attributes array in DB)
    for (const [key, value] of searchParams.entries()) {
      if (!staticFields.includes(key.toLowerCase())) {
        const values = searchParams.getAll(key).filter(v => v.trim() !== '');
        if (values.length > 0) {
          if (!query.$and) query.$and = [];
          query.$and.push({
            attributes: {
              $elemMatch: {
                key: new RegExp('^' + key + '$', 'i'),
                value: { $in: values.map(v => new RegExp('^' + v + '$', 'i')) }
              }
            }
          });
        }
      }
    }

    const totalItems = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Transform MongoDB _id to string id to match existing ProductType format
    const transformedProducts = products.map((p) => {
      const doc = p.toObject();
      return {
        id: doc._id.toString(),
        slug: doc.slug,
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

    return NextResponse.json({ 
      success: true, 
      data: transformedProducts,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error: any) {
    console.error('Error fetching public products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
