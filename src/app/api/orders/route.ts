import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Coupon from '@/models/Coupon';
import mongoose from 'mongoose';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const {
      cartItems,
      shippingAddress,
      customerEmail: reqCustomerEmail,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      couponCode,
      discountAmount
    } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing Razorpay payment details' }, { status: 400 });
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const customerEmail = reqCustomerEmail || 'guest@example.com';

    // Link User ObjectId
    let userId: mongoose.Types.ObjectId | null = null;
    if (customerEmail !== 'guest@example.com') {
      const user = await User.findOne({ email: customerEmail }).select('_id');
      if (user) userId = user._id;
    }

    // Recalculate totals securely + oversell guard
    const parsePrice = (price: any) =>
      typeof price === 'number' ? price : parseFloat((price || '').toString().replace(/[^0-9.-]+/g, '')) || 0;

    let subtotal = 0;
    const orderProducts = [];

    for (const item of cartItems) {
      let product = null;
      if (mongoose.Types.ObjectId.isValid(item.product.id)) {
        product = await Product.findById(item.product.id);
      }

      if (product && product.stockCount < item.quantity) {
        return NextResponse.json(
          { error: `"${product.title}" only has ${product.stockCount} units in stock.` },
          { status: 409 }
        );
      }

      const priceAtPurchase = product ? parsePrice(product.price) : parsePrice(item.product.price);
      subtotal += priceAtPurchase * item.quantity;

      orderProducts.push({
        product: product ? product._id : null,
        quantity: item.quantity,
        priceAtPurchase,
        variants: item.variants || {}
      });
    }

    const shippingCost = subtotal > 0 ? (subtotal > 10000 ? 0 : 500) : 0;
    const taxAmount = subtotal * 0.18;
    const finalDiscount = discountAmount || 0;
    const totalAmount = subtotal + shippingCost + taxAmount - finalDiscount;

    // Mock 3PL integration
    const mockTrackingId = 'AWB' + Math.floor(100000000 + Math.random() * 900000000).toString();
    const mockCouriers = ['Delhivery', 'Bluedart', 'Ecom Express', 'Xpressbees'];
    const assignedCourier = mockCouriers[Math.floor(Math.random() * mockCouriers.length)];
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3 + Math.floor(Math.random() * 4));

    // Create the order
    const order = await Order.create({
      user: userId,
      customerEmail,
      products: orderProducts,
      subtotal,
      shippingCost,
      taxAmount,
      discountAmount: finalDiscount,
      couponCode: couponCode || null,
      totalAmount,
      paymentStatus: 'paid',
      paymentMethod: 'Razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      shippingStatus: 'processing',
      shippingAddress: {
        name: shippingAddress.name || reqCustomerEmail?.split('@')[0] || 'Guest',
        phone: shippingAddress.phone || '0000000000',
        houseNumber: shippingAddress.houseNumber || 'N/A',
        street: shippingAddress.street || 'N/A',
        area: shippingAddress.area || '',
        landmark: shippingAddress.landmark || '',
        city: shippingAddress.city || 'Unknown',
        state: shippingAddress.state || 'Unknown',
        zip: shippingAddress.zip || '000000',
        country: shippingAddress.country || 'India'
      },
      trackingId: mockTrackingId,
      courierName: assignedCourier,
      estimatedDelivery: estimatedDeliveryDate
    });

    // Decrement stock after order confirmed
    for (const item of orderProducts) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockCount: -item.quantity }
        });
      }
    }

    // Increment coupon usedCount
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode },
        { $inc: { usedCount: 1 } }
      );
    }

    return NextResponse.json({ success: true, orderId: order._id }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating order:', error);
    require('fs').writeFileSync('d:/golf-ecom/error_log.txt', error.stack || error.message);
    return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
  }
}
