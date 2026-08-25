import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { createAdminSession } from '@/lib/adminAuth';

export async function POST(req: Request) {
  let email = '';
  try {
    const body = await req.json();
    email = body.email;
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Mock logic for local development if MongoDB is blocked
    if (process.env.NODE_ENV === 'development' && email === 'admin@golfpro.com' && password === 'admin123') {
      await createAdminSession('mock-admin-1', email);
      return NextResponse.json({ success: true, message: 'Logged in successfully (Mock)' });
    }

    await dbConnect();
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Not an admin.' }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await createAdminSession(user._id.toString(), user.email);

    return NextResponse.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Admin login error:', error);
    
    // Seamless mock fallback for dev
    if (process.env.NODE_ENV === 'development' && email === 'admin@golfpro.com') {
      await createAdminSession('mock-admin-1', email);
      return NextResponse.json({ success: true, message: 'Logged in successfully (Mock Fallback)' });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
