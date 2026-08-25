import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerEmail: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
    variants: { type: Map, of: String }
  }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  shippingStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
  shippingAddress: { 
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
