import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  images: [{ type: String }],
  category: { type: String, required: true },
  brand: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  gender: { type: String },
  style: { type: String },
  type: { type: String },
  loft: { type: String },
  size: { type: String },
  features: [{ type: String }],
  attributes: [{
    key: { type: String },
    value: { type: String }
  }],
  variants: [{
    id: { type: String, required: true },
    color: { type: String },
    colorCode: { type: String },
    size: { type: String },
    stockCount: { type: Number, default: 0 },
    images: [{ type: String }]
  }],
  isFeatured: { type: Boolean, default: false },
  isTopDeal: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false }
}, { timestamps: true });

ProductSchema.index({ isTopDeal: 1 });
ProductSchema.index({ isNewArrival: 1, inStock: 1, createdAt: -1 });
ProductSchema.index({ isFeatured: 1, createdAt: -1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
