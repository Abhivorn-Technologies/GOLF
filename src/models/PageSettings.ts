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
  image: String,
  icon: String
});

const SubCategorySettingSchema = new mongoose.Schema({
  id: String,
  name: String,
  image: String
});

const UtilityBarSchema = new mongoose.Schema({
  announcements: [String]
});

const PageSettingsSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true }, // e.g., "clubs", "global"
  bestBrands: [BrandSettingSchema],
  shopByCategory: [CategorySettingSchema],
  subCategories: [SubCategorySettingSchema],
  allowedFilters: [String], // Array of attribute names to show in sidebar (e.g. ['Hand', 'Dexterity', 'Flex'])
  utilityBar: UtilityBarSchema // For global utility bar settings
}, { timestamps: true });

// Clear mongoose model in development to prevent strict schema caching issues on hot reload
if (process.env.NODE_ENV !== 'production' && mongoose.models.PageSettings) {
  delete mongoose.models.PageSettings;
}

export default mongoose.models.PageSettings || mongoose.model('PageSettings', PageSettingsSchema);
