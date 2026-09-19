import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  eyebrow: { type: String },
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
  eyebrowColor: { type: String, default: '#ffffff' },
  overlayOpacity: { type: Number, default: 40 },
  alignment: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
  buttonSize: { type: String, enum: ['sm', 'md', 'lg', 'xl'], default: 'md' },
  titlePosition: {
    x: { type: Number, default: 10 },
    y: { type: Number, default: 20 }
  },
  eyebrowPosition: {
    x: { type: Number, default: 10 },
    y: { type: Number, default: 10 }
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

BannerSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
