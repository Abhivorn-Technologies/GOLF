import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';

export async function POST(req: Request) {
  try {
    await connectMongo();
    
    const session = await getServerSession();
    
    const body = await req.json();
    const { cartItems, shippingAddress, customerEmail } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }

    let subtotal = 0;

    const orderProducts = [];
    
    for (const item of cartItems) {
      const productDoc = await Product.findById(item.product.id);
      if (!productDoc) {
        return NextResponse.json({ error: `Product ${item.product.name} not found` }, { status: 400 });
      }

      // Handle price parsing safely
      let price = 0;
      if (typeof productDoc.price === 'number') {
        price = productDoc.price;
      } else if (typeof productDoc.price === 'string') {
        price = parseFloat(productDoc.price.replace(/[^0-9.-]+/g, ""));
      }

      subtotal += price * item.quantity;

      orderProducts.push({
        product: productDoc._id,
        quantity: item.quantity,
        priceAtPurchase: price,
        variants: item.variants || {}
      });

      // Deduct global stock
      productDoc.stockCount = Math.max(0, productDoc.stockCount - item.quantity);
      if (productDoc.stockCount === 0) {
        productDoc.inStock = false;
      }

      // Deduct variant stock if applicable (e.g. Size string is "S:10, M:5")
      if (item.variants) {
        const updateVariantStock = (field: 'size' | 'loft' | 'style', variantKey: string) => {
           if (productDoc[field]) {
             const parts = productDoc[field].split(',').map((s: string) => s.trim());
             const updatedParts = parts.map((part: string) => {
                if (part.includes(':')) {
                   const [name, stockStr] = part.split(':');
                   if (name.trim() === item.variants[variantKey]) {
                      const newStock = Math.max(0, parseInt(stockStr.trim()) - item.quantity);
                      return `${name.trim()}:${newStock}`;
                   }
                }
                return part;
             });
             productDoc[field] = updatedParts.join(', ');
           }
        };

        if (item.variants['Size']) updateVariantStock('size', 'Size');
        if (item.variants['Loft']) updateVariantStock('loft', 'Loft');
        if (item.variants['Style']) updateVariantStock('style', 'Style');
      }

      await productDoc.save();
    }

    const shipping = subtotal > 0 ? 500 : 0;
    const taxes = subtotal * 0.18;
    const totalAmount = subtotal + shipping + taxes;

    // Use session user email, or fallback to body email, or a dummy email
    const email = session?.user?.email || customerEmail || 'guest@example.com';
    // If we have a user in the DB matching the session email, link it.
    let userId = null;
    if (session?.user?.email) {
       const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String }));
       const user = await User.findOne({ email: session.user.email });
       if (user) userId = user._id;
    }

    const order = await Order.create({
      user: userId,
      customerEmail: email,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentStatus: 'paid', // Simulating successful payment
      shippingStatus: 'processing'
    });

    return NextResponse.json({ success: true, orderId: order._id }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
