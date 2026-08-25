import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/db';
import Order from '@/models/Order';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(adminToken, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectMongo();
    
    const body = await req.json();
    const { shippingStatus, paymentStatus } = body;

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (shippingStatus) order.shippingStatus = shippingStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
