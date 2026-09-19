import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import mongoose from 'mongoose';

const parsePrice = (price: any): number => {
  if (typeof price === 'number') return price;
  const parsed = parseFloat((price || '').toString().replace(/[^0-9.-]+/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay API keys are missing.' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    await dbConnect();
    const body = await req.json();
    const { cartItems, couponCode } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let subtotal = 0;

    for (const item of cartItems) {
      let product: any = null;

      if (item.product?.id && mongoose.Types.ObjectId.isValid(item.product.id)) {
        product = await Product.findById(item.product.id).lean();
      }
      if (!product && item.product?.slug) {
        product = await Product.findOne({ slug: item.product.slug }).lean();
      }

      if (!product) {
        console.error('[Razorpay] Product not found:', item.product?.id, item.product?.name);
        return NextResponse.json({ error: `Product not found: ${item.product?.name || item.product?.id}` }, { status: 404 });
      }

      const variantId = item.variants?.variantId;
      if (variantId) {
        const variant = product.variants?.find((v: any) => v.id === variantId);
        if (variant && variant.stockCount < item.quantity) {
          return NextResponse.json(
            { error: `"${product.name}" variant only has ${variant.stockCount} units in stock.` },
            { status: 409 }
          );
        }
      } else {
        const stock = product.stockCount ?? 9999;
        if (stock < item.quantity) {
          return NextResponse.json(
            { error: `"${product.name}" only has ${stock} units in stock.` },
            { status: 409 }
          );
        }
      }

      subtotal += parsePrice(product.price) * item.quantity;
    }

    // All-inclusive pricing — no shipping or taxes
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
      if (coupon) {
        let isValid = true;
        if (coupon.expiresAt && new Date() > coupon.expiresAt) isValid = false;
        if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) isValid = false;
        if (subtotal < coupon.minOrderAmount) isValid = false;
        if (isValid) {
          discountAmount = coupon.discountType === 'percentage'
            ? Math.min((subtotal * coupon.discountValue) / 100, subtotal)
            : Math.min(coupon.discountValue, subtotal);
        }
      }
    }

    const totalAmount = Math.max(1, subtotal - discountAmount);
    const amountInPaise = Math.round(totalAmount * 100);

    console.log('[Razorpay] subtotal:', subtotal, '| discount:', discountAmount, '| total:', totalAmount, '| paise:', amountInPaise);
    console.log('[Razorpay] key_id prefix:', keyId?.slice(0, 12));

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json(order, { status: 200 });

  } catch (error: any) {
    const msg = error?.message || error?.error?.description || JSON.stringify(error);
    console.error('[Razorpay] Order creation failed:', msg);
    return NextResponse.json(
      { error: 'Failed to create Razorpay order', details: msg },
      { status: 500 }
    );
  }
}
