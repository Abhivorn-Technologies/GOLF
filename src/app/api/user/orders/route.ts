import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;

    // Fetch orders for this email
    const orders = await Order.find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .populate('products.product') // Ensure Product model is registered and populated if needed
      .exec();

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Failed to fetch user orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;
    const body = await req.json();
    const { orderId, action, reason } = body;

    if (!orderId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const order = await Order.findOne({ _id: orderId, customerEmail: email });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (action === 'cancel' && order.shippingStatus === 'processing') {
      order.shippingStatus = 'cancelled';
      order.cancellationReason = reason;
    } else if (action === 'return' && order.shippingStatus === 'delivered') {
      order.returnStatus = 'requested';
      order.returnReason = reason;
    } else {
      return NextResponse.json({ error: 'Invalid action for current order status' }, { status: 400 });
    }

    await order.save();
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Failed to update user order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
