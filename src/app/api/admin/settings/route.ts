import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 'clubs';
    
    await dbConnect();
    let settings = await PageSettings.findOne({ page }).lean();
    
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Error fetching page settings:", error);
    return NextResponse.json({ error: "Failed to fetch page settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    const user = await User.findOne({ email: session.user?.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const page = data.page || 'clubs';

    const updated = await PageSettings.findOneAndUpdate(
      { page },
      { $set: data },
      { new: true, upsert: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating page settings:", error);
    return NextResponse.json({ error: "Failed to update page settings" }, { status: 500 });
  }
}
