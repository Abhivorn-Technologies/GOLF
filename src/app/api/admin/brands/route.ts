import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';

export async function GET() {
  try {
    await dbConnect();
    const brands = await Brand.find({}).sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    
    const newBrand = await Brand.create(body);
    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
