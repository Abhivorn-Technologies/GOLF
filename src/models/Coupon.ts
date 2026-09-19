import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },      // % or flat ₹ amount
  maxUses: { type: Number, default: null },             // null = unlimited
  usedCount: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  description: { type: String }
}, { timestamps: true });

CouponSchema.index({ code: 1, isActive: 1 });

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);