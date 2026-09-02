import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { code, subtotal } = await req.json();

    if (!code) return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 });

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (subtotal < coupon.minOrderAmount) {
      return NextResponse.json({ error: `Minimum order of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required for this coupon` }, { status: 400 });
    }

    const discount = coupon.discountType === 'percentage'
      ? Math.min((subtotal * coupon.discountValue) / 100, subtotal)
      : Math.min(coupon.discountValue, subtotal);

    return NextResponse.json({
      valid: true,
      discount: Math.round(discount * 100) / 100,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      description: coupon.description || `${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '₹' + coupon.discountValue} off`
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to validate coupon", details: error.message }, { status: 500 });
  }
}