import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  categories: { type: [String], default: [] }
}, { timestamps: true });

BrandSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
