import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET() {
  await dbConnect();
  
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    }).lean();

    // Filter out coupons that have reached their maxUses limit
    const availableCoupons = coupons.filter(c => c.maxUses === null || c.usedCount < c.maxUses);

    // Only send non-sensitive fields to the frontend
    const safeCoupons = availableCoupons.map(c => ({
      code: c.code,
      description: c.description,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount
    }));

    return NextResponse.json({ coupons: safeCoupons });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}
