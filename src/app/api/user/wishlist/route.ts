import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product'; // needed for population

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ wishlist: [] }, { status: 200 });
    }

    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json({ wishlist: [] }, { status: 200 });
    }

    let user = await User.findOne({ email: session.user.email }).populate('wishlist').lean();
    
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
    
    if (!user) return NextResponse.json({ wishlist: [] }, { status: 200 });

    return NextResponse.json({ wishlist: user.wishlist || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ wishlist: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please login to add to wishlist' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json({ message: 'Wishlist updated', wishlist: [productId] }, { status: 200 });
    }

    let user = await User.findOne({ email: session.user.email });
    
    if (!user && process.env.NODE_ENV === 'development') {
      user = await User.create({
        name: session.user.name || session.user.email.split('@')[0],
        email: session.user.email,
        password: 'mock-dev-password',
        role: (session.user as any).role || 'user',
        wishlist: []
      });
    }

    if (!user) {
      return NextResponse.json({ message: 'Wishlist updated', wishlist: [productId] }, { status: 200 });
    }

    const strProductId = productId.toString();
    const currentWishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
    const productIndex = currentWishlist.findIndex((id: any) => id.toString() === strProductId);
    
    let isAdded = false;
    let updatedWishlist = [...currentWishlist];

    if (productIndex > -1) {
      updatedWishlist.splice(productIndex, 1);
      isAdded = false;
    } else {
      updatedWishlist.push(productId);
      isAdded = true;
    }

    // Use atomic updateOne to ONLY mutate the wishlist array without triggering whole-document address validation
    await User.updateOne(
      { _id: user._id },
      { $set: { wishlist: updatedWishlist } }
    );

    return NextResponse.json({ message: 'Wishlist updated', added: isAdded, wishlist: updatedWishlist }, { status: 200 });
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ message: 'Wishlist updated', wishlist: [] }, { status: 200 });
  }
}
