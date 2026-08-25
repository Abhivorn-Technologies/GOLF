import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });
// Clear cache in development to ensure schema updates take effect
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Banner;
}

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
