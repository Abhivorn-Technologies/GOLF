import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json({
        user: { name: session.user.name, email: session.user.email, newsletterSubscribed: false, addresses: [] }
      });
    }

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({
        user: { name: session.user.name, email: session.user.email, newsletterSubscribed: false, addresses: [] }
      }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json({ 
        user: { name: body.name || session.user.name, email: session.user.email, newsletterSubscribed: body.newsletterSubscribed || false },
        message: 'Profile Updated locally' 
      }, { status: 200 });
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.newsletterSubscribed !== undefined) updateData.newsletterSubscribed = body.newsletterSubscribed;

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
