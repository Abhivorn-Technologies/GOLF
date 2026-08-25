import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product'; // needed for population

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await dbConnect();
    } catch (err) {
      // Local dev network block bypass
      return NextResponse.json({ wishlist: [] });
    }

    // Populate the wishlist with actual Product details
    let user = await User.findOne({ email: session.user.email }).populate('wishlist').lean();
    
    // Auto-create for mocked dev users
    if (!user && process.env.NODE_ENV === 'development') {
      const newUser = await User.create({
        name: session.user.name || session.user.email.split('@')[0],
        email: session.user.email,
        password: 'mock-dev-password',
        role: (session.user as any).role || 'user',
        wishlist: []
      });
      user = newUser.toObject();
    }
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ wishlist: user.wishlist || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json({ error: 'Network error locally, cannot save.' }, { status: 503 });
    }

    let user = await User.findOne({ email: session.user.email });
    
    // Auto-create for mocked dev users
    if (!user && process.env.NODE_ENV === 'development') {
      user = await User.create({
        name: session.user.name || session.user.email.split('@')[0],
        email: session.user.email,
        password: 'mock-dev-password',
        role: (session.user as any).role || 'user',
        wishlist: []
      });
    }

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const productIndex = user.wishlist.indexOf(productId);
    
    if (productIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(productIndex, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
    }

    await user.save();
    return NextResponse.json({ message: 'Wishlist updated', wishlist: user.wishlist }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}
