import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  imageUrl: { type: String, required: true },
  mobileImageUrl: { type: String },
  linkUrl: { type: String },
  buttonText: { type: String },
  buttonColor: { type: String, default: '#16a34a' },
  buttonTextColor: { type: String, default: '#ffffff' },
  button2Text: { type: String },
  button2Url: { type: String },
  button2Color: { type: String, default: '#ffffff' },
  button2TextColor: { type: String, default: '#000000' },
  titleColor: { type: String, default: '#ffffff' },
  subtitleColor: { type: String, default: '#e4e4e7' },
  overlayOpacity: { type: Number, default: 40 },
  alignment: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
  buttonSize: { type: String, enum: ['sm', 'md', 'lg', 'xl'], default: 'md' },
  titlePosition: {
    x: { type: Number, default: 10 },
    y: { type: Number, default: 20 }
  },
  subtitlePosition: {
    x: { type: Number, default: 10 },
    y: { type: Number, default: 40 }
  },
  buttonPosition: {
    x: { type: Number, default: 10 },
    y: { type: Number, default: 60 }
  },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });
// Clear cache in development to ensure schema updates take effect
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Banner;
}

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
