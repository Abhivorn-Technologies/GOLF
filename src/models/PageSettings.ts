import mongoose from 'mongoose';

const BrandSettingSchema = new mongoose.Schema({
  id: String,
  name: String,
  link: String,
  color: String,
  image: String
});

const CategorySettingSchema = new mongoose.Schema({
  id: String,
  name: String,
  desc: String,
  href: String,
  color: String,
  image: String
});

const PageSettingsSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true }, // e.g., "clubs"
  bestBrands: [BrandSettingSchema],
  shopByCategory: [CategorySettingSchema]
}, { timestamps: true });

export default mongoose.models.PageSettings || mongoose.model('PageSettings', PageSettingsSchema);
