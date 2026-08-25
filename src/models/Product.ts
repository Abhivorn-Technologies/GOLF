import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
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
  isFeatured: { type: Boolean, default: false },
  isTopDeal: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false }
}, { timestamps: true });

// Clear mongoose model in development to prevent strict schema caching issues on hot reload
if (process.env.NODE_ENV !== 'production' && mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
