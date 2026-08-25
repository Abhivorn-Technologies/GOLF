import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Automatically set displayOrder if not provided
    if (data.displayOrder === undefined || data.displayOrder === 0) {
      const highestBanner = await Banner.findOne().sort({ displayOrder: -1 }).lean();
      data.displayOrder = highestBanner ? (highestBanner.displayOrder + 1) : 1;
    }

    const banner = await Banner.create(data);
    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create banner:", error);
    return NextResponse.json({ error: error.message || 'Failed to create banner' }, { status: 500 });
  }
}
