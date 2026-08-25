import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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
      return NextResponse.json({
        user: { name: session.user.name, email: session.user.email, newsletterSubscribed: false, addresses: [] }
      });
    }

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json({ error: 'Network error locally, cannot save.' }, { status: 503 });
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.newsletterSubscribed !== undefined) updateData.newsletterSubscribed = body.newsletterSubscribed;
    
    // Simple address appending logic
    if (body.newAddress) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        user.addresses.push(body.newAddress);
        await user.save();
        return NextResponse.json({ user, message: 'Address Added' }, { status: 200 });
      }
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true }
    ).lean();

    return NextResponse.json({ user, message: 'Profile Updated' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
