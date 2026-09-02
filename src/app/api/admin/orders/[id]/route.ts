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
      estimatedDelivery,
      returnStatus,
      refundAmount,
    } = body;

    const updateData: Record<string, any> = {};
    if (shippingStatus)   updateData.shippingStatus   = shippingStatus;
    if (paymentStatus)    updateData.paymentStatus     = paymentStatus;
    if (trackingId !== undefined)        updateData.trackingId        = trackingId;
    if (courierName !== undefined)       updateData.courierName       = courierName;
    if (estimatedDelivery !== undefined) updateData.estimatedDelivery = estimatedDelivery;
    if (returnStatus)     updateData.returnStatus      = returnStatus;
    if (refundAmount !== undefined)      updateData.refundAmount      = refundAmount;

    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update order", details: error.message }, { status: 500 });
  }
}