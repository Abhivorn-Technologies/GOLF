import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyAdminSession } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    
    const category = req.nextUrl.searchParams.get('category');
    const query = category ? { category: category.toLowerCase() } : {};

    // Get all unique attribute keys used in the dynamic attributes array for this category
    const attributeKeys = await Product.distinct('attributes.key', query);

    // Also could include static ones if we wanted, but the form already handles Gender, Style, Size, Loft explicitly.
    // So we only return the dynamic ones.
    
    return NextResponse.json({ attributes: attributeKeys });
  } catch (error: any) {
    console.error('Failed to fetch attributes:', error);
    return NextResponse.json({ error: 'Failed to fetch attributes' }, { status: 500 });
  }
}
