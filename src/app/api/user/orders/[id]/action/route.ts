import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;
    const { id: orderId } = await context.params;
    const body = await req.json();
    const { action, reason, rating, comment } = body;

    // Find the order and ensure it belongs to the logged-in user
    const order = await Order.findOne({ _id: orderId, customerEmail: email });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (action === 'cancel') {
      if (order.shippingStatus !== 'processing') {
        return NextResponse.json({ error: 'Order cannot be cancelled at this stage' }, { status: 400 });
      }
      order.shippingStatus = 'cancelled';
      order.cancellationReason = reason || 'No reason provided';
      await order.save();
      return NextResponse.json({ success: true, message: 'Order cancelled successfully', order });
    }

    if (action === 'return') {
      if (order.shippingStatus !== 'delivered') {
        return NextResponse.json({ error: 'Only delivered orders can be returned' }, { status: 400 });
      }
      if (order.returnStatus !== 'none') {
        return NextResponse.json({ error: 'Return already requested' }, { status: 400 });
      }
      order.returnStatus = 'requested';
      order.returnReason = reason || 'No reason provided';
      await order.save();
      return NextResponse.json({ success: true, message: 'Return requested successfully', order });
    }

    if (action === 'feedback') {
      if (order.shippingStatus !== 'delivered') {
        return NextResponse.json({ error: 'Feedback can only be left for delivered orders' }, { status: 400 });
      }
      if (!rating || rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Valid rating between 1 and 5 is required' }, { status: 400 });
      }
      order.feedback = { rating, comment: comment || '' };
      await order.save();
      return NextResponse.json({ success: true, message: 'Feedback submitted successfully', order });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Failed to process order action:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
