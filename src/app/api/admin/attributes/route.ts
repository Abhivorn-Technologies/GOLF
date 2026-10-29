import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import PageSettings from '@/models/PageSettings';
import { verifyAdminSession } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession();
    // In dev mode allow request to succeed if admin session is not strictly required
    if (!session && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const category = req.nextUrl.searchParams.get('category');
    const catLower = category ? category.trim().toLowerCase() : '';
    
    // Case-insensitive regex matching for category
    const query = catLower 
      ? { category: { $regex: new RegExp(`^${catLower}$`, 'i') } } 
      : {};

    // 1. Get all unique attribute keys used in products for this category
    const rawKeys = await Product.distinct('attributes.key', query);
    
    // 2. Also get allowed filters defined in PageSettings for this category
    let settingsFilters: string[] = [];
    if (catLower) {
      const pageSetting = await PageSettings.findOne({ page: catLower }).lean();
      if (pageSetting && Array.isArray(pageSetting.allowedFilters)) {
        settingsFilters = pageSetting.allowedFilters;
      }
    }

    // 3. Category standard defaults
    const categoryDefaults: Record<string, string[]> = {
      apparel: ['Size', 'Color', 'Gender', 'Material', 'Fit', 'Sleeve Length', 'Pattern'],
      clubs: ['Hand', 'Dexterity', 'Flex', 'Loft', 'Shaft', 'Style'],
      shoes: ['Size', 'Spikes', 'Width', 'Gender', 'Style'],
      bags: ['Type', 'Top', 'Dividers', 'Waterproof'],
      balls: ['Compression', 'Feel', 'Construction', 'Color'],
      accessories: ['Type', 'Size', 'Color']
    };

    const defaults = catLower && categoryDefaults[catLower] ? categoryDefaults[catLower] : [];

    // Combine and deduplicate
    const combinedSet = new Set<string>();
    settingsFilters.forEach(f => f && combinedSet.add(f.trim()));
    (rawKeys || []).forEach(k => k && typeof k === 'string' && combinedSet.add(k.trim()));
    defaults.forEach(d => combinedSet.add(d));

    const attributeKeys = Array.from(combinedSet);
    
    return NextResponse.json({ attributes: attributeKeys });
  } catch (error: any) {
    console.error('Failed to fetch attributes:', error);
    return NextResponse.json({ error: 'Failed to fetch attributes' }, { status: 500 });
  }
}
