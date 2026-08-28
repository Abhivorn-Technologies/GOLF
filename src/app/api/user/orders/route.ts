import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String }));
    const user = await User.findOne({ email: session.user.email });
    
    // We can fetch by user ID or customerEmail
    let query = {};
    if (user) {
      query = { $or: [{ user: user._id }, { customerEmail: session.user.email }] };
    } else {
      query = { customerEmail: session.user.email };
    }

    require('@/models/Product');
    const orders = await Order.find(query)
      .populate('products.product', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error('Fetch user orders error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
