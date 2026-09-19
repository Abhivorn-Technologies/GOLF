import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { verifyAdminSession } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || 'all';

    const skip = (page - 1) * limit;

    let query: any = {
      $or: [
        { shippingStatus: 'cancelled' },
        { returnStatus: { $in: ['requested', 'approved', 'rejected', 'refunded'] } }
      ]
    };
    
    if (status !== 'all') {
      if (status === 'cancelled') {
        query.shippingStatus = 'cancelled';
      } else {
        query.returnStatus = status;
      }
    }

    if (search) {
      query = {
        $and: [
          query,
          {
            $or: [
              { _id: search.length === 24 ? search : null },
              { 'customerEmail': { $regex: search, $options: 'i' } }
            ].filter(cond => Object.values(cond)[0] !== null)
          }
        ]
      };
    }

    const [returns, totalCount] = await Promise.all([
      Order.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('products.product')
        .exec(),
      Order.countDocuments(query)
    ]);

    return NextResponse.json({ returns, totalCount });
  } catch (error: any) {
    console.error('Failed to fetch admin returns:', error);
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    
    const body = await req.json();
    const { orderId, returnStatus, shippingStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const wasCancelled = existingOrder.shippingStatus === 'cancelled';
    const wasRefunded = ['approved', 'refunded'].includes(existingOrder.returnStatus);

    const isNowCancelled = shippingStatus === 'cancelled';
    const isNowRefunded = returnStatus && ['approved', 'refunded'].includes(returnStatus);

    // Automatic inventory restocking
    if ((isNowCancelled && !wasCancelled) || (isNowRefunded && !wasRefunded)) {
      for (const item of existingOrder.products) {
        if (item.product) {
          const variantId = item.variants?.get ? item.variants.get('variantId') : item.variants?.variantId;
          if (variantId) {
            await Product.updateOne(
              { _id: item.product, "variants.id": variantId },
              { $inc: { "variants.$.stockCount": item.quantity } }
            );
          } else {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stockCount: item.quantity },
              inStock: true
            });
          }
        }
      }
    }

    const updateData: any = {};
    if (returnStatus) updateData.returnStatus = returnStatus;
    if (shippingStatus) updateData.shippingStatus = shippingStatus;

    if (returnStatus === 'refunded') {
      if (!existingOrder.refundAmount) {
        updateData.refundAmount = existingOrder.totalAmount;
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Failed to update return:', error);
    return NextResponse.json({ error: 'Failed to update return' }, { status: 500 });
  }
}
