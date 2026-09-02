import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay API keys are missing from environment variables.");
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    await dbConnect();
    const body = await req.json();
    const { cartItems, shippingAddress, discountAmount = 0 } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Recalculate totals on the server securely
    let subtotal = 0;

    for (const item of cartItems) {
      const parsePrice = (price: any) => typeof price === 'number' ? price : parseFloat((price || "").toString().replace(/[^0-9.-]+/g, "")) || 0;
      
      let product = null;
      if (mongoose.Types.ObjectId.isValid(item.product.id)) {
        product = await Product.findById(item.product.id);
      }
      
      const priceAtPurchase = product ? parsePrice(product.price) : parsePrice(item.product.price);
      subtotal += priceAtPurchase * item.quantity;
    }

    const shipping = subtotal > 0 ? (subtotal > 10000 ? 0 : 500) : 0;
    const taxes = shippingAddress ? subtotal * 0.18 : 0;
    const totalAmount = subtotal + shipping + taxes - discountAmount;

    // Razorpay requires amount in paise (multiply by 100)
    const options = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order, { status: 200 });

  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order', details: error.message }, { status: 500 });
  }
}
