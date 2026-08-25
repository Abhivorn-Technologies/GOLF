import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

// Clear cache in development to ensure schema updates take effect
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Brand;
}

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
