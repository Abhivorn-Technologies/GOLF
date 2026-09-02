import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    // In a real application, you would verify a webhook signature here 
    // to ensure the request is actually coming from Shiprocket/Delhivery.
    
    const body = await req.json();
    
    // Example webhook payload from a 3PL:
    // { "awb": "AWB123456789", "current_status": "SHIPPED", "timestamp": "..." }
    const { awb, current_status } = body;

    if (!awb || !current_status) {
      return NextResponse.json({ error: 'Missing required webhook fields' }, { status: 400 });
    }

    await dbConnect();

    // Map 3PL status to our internal shippingStatus enum
    let internalStatus = 'processing';
    const statusUpper = current_status.toUpperCase();
    
    if (statusUpper === 'SHIPPED' || statusUpper === 'IN_TRANSIT') {
      internalStatus = 'shipped';
    } else if (statusUpper === 'DELIVERED') {
      internalStatus = 'delivered';
    } else if (statusUpper === 'CANCELLED' || statusUpper === 'RTO') { // RTO = Return to Origin
      internalStatus = 'cancelled';
    }

    // Update the order based on tracking ID
    const updatedOrder = await Order.findOneAndUpdate(
      { trackingId: awb },
      { $set: { shippingStatus: internalStatus } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found for given AWB' }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedStatus: internalStatus });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
