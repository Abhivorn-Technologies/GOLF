import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';
import { verifyAdminSession } from '@/lib/adminAuth';
import { clearPageSettingsCache } from '@/lib/pageSettings';
import { clearProductCache } from '@/app/api/products/public/route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 'clubs';
    
    await dbConnect();
    const settings = await PageSettings.findOne({ page }).lean();
    
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Error fetching page settings:", error);
    return NextResponse.json({ error: "Failed to fetch page settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifyAdminSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const page = data.page || 'clubs';

    const updated = await PageSettings.findOneAndUpdate(
      { page },
      { $set: data },
      { new: true, upsert: true }
    );

    clearPageSettingsCache(page);
    clearProductCache();

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating page settings:", error);
    return NextResponse.json({ error: error.message || "Failed to update page settings" }, { status: 500 });
  }
}
