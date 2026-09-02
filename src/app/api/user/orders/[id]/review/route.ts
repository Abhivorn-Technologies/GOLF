import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const order = await Order.findOne({ _id: id, customerEmail: session.user.email });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.shippingStatus !== "delivered") {
      return NextResponse.json({ error: "Can only review delivered orders" }, { status: 400 });
    }

    if (order.feedback?.rating) {
      return NextResponse.json({ error: "You have already reviewed this order" }, { status: 409 });
    }

    order.feedback = { rating, comment: comment || "", createdAt: new Date() };
    await order.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to save review", details: error.message }, { status: 500 });
  }
}