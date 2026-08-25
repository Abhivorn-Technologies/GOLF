import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to connect to the DB
    try {
      await dbConnect();
    } catch (dbError) {
      console.error("Database offline. Returning empty orders for local testing.");
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    // Fetch the logged-in user's orders from the database
    const orders = await Order.find({ customerEmail: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
