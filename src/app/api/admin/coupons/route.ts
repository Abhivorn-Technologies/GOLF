import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const [coupons, totalCount] = await Promise.all([
    Coupon.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Coupon.countDocuments({})
  ]);

  return NextResponse.json({ coupons, totalCount });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const body = await req.json();
  const { code, discountType, discountValue, maxUses, minOrderAmount, expiresAt, description } = body;
  if (!code || !discountType || discountValue === undefined || discountValue === null) {
    return NextResponse.json({ error: "code, discountType, and discountValue are required" }, { status: 400 });
  }
  try {
    const coupon = await Coupon.create({ code, discountType, discountValue, maxUses: maxUses || null, minOrderAmount: minOrderAmount || 0, expiresAt: expiresAt || null, description });
    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create coupon", details: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const { id } = await req.json();
  await Coupon.findByIdAndUpdate(id, { isActive: false });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const body = await req.json();
  const { id, code, discountType, discountValue, maxUses, minOrderAmount, expiresAt, description } = body;
  
  if (!id || !code || !discountType || discountValue === undefined || discountValue === null) {
    return NextResponse.json({ error: "id, code, discountType, and discountValue are required" }, { status: 400 });
  }

  try {
    const updated = await Coupon.findByIdAndUpdate(
      id, 
      { code, discountType, discountValue, maxUses: maxUses || null, minOrderAmount: minOrderAmount || 0, expiresAt: expiresAt || null, description },
      { new: true }
    );
    return NextResponse.json({ success: true, coupon: updated });
  } catch (err: any) {
    if (err.code === 11000) return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to update coupon", details: err.message }, { status: 500 });
  }
}