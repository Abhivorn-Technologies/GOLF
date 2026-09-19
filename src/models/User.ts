import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  name: { type: String, maxlength: 50 },
  phone: { type: String, maxlength: 20 },
  houseNumber: { type: String, maxlength: 100 },
  street: { type: String, maxlength: 100 },
  area: { type: String, maxlength: 100 },
  landmark: { type: String, maxlength: 100 },
  city: { type: String, maxlength: 50 },
  state: { type: String, maxlength: 50 },
  zip: { type: String, maxlength: 20 },
  country: { type: String, maxlength: 50, default: 'India' },
  isDefaultBilling: { type: Boolean, default: false },
  isDefaultShipping: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  newsletterSubscribed: { type: Boolean, default: false },
  addresses: [AddressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
