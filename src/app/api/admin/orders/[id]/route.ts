import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = await params;

    const order = await Order.findById(id).populate("products.product").exec();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch order", details: error.message }, { status: 500 });
  }
}

import Product from "@/models/Product";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAdminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const {
      shippingStatus,
      paymentStatus,
      trackingId,
      courierName,
      deliveryAgentName,
      deliveryAgentPhone,
      estimatedDelivery,
      returnStatus,
      refundAmount,
    } = body;

    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const wasCancelled = existingOrder.shippingStatus === 'cancelled';
    const wasRefunded = ['approved', 'refunded'].includes(existingOrder.returnStatus);

    const isNowCancelled = shippingStatus === 'cancelled';
    const isNowRefunded = returnStatus && ['approved', 'refunded'].includes(returnStatus);

    // Restock inventory if transitioning to cancelled or return approved/refunded
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

    const updateData: Record<string, any> = {};
    if (shippingStatus)   updateData.shippingStatus   = shippingStatus;
    if (paymentStatus)    updateData.paymentStatus     = paymentStatus;
    if (trackingId !== undefined)        updateData.trackingId        = trackingId;
    if (courierName !== undefined)       updateData.courierName       = courierName;
    if (deliveryAgentName !== undefined) updateData.deliveryAgentName = deliveryAgentName;
    if (deliveryAgentPhone !== undefined) updateData.deliveryAgentPhone = deliveryAgentPhone;
    if (estimatedDelivery !== undefined) updateData.estimatedDelivery = estimatedDelivery;
    if (returnStatus)     updateData.returnStatus      = returnStatus;
    if (refundAmount !== undefined)      updateData.refundAmount      = refundAmount;

    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("Failed to update order:", error);
    return NextResponse.json({ error: "Failed to update order", details: error.message }, { status: 500 });
  }
}