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

  // Price breakdown
  subtotal: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  totalAmount: { type: Number, required: true },

  // Payment
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentMethod: { type: String, default: 'Razorpay' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },

  // Shipping
  shippingStatus: {
    type: String,
    enum: ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'processing'
  },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String },
    houseNumber: { type: String },
    street: { type: String, required: true },
    area: { type: String },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  trackingId: { type: String },
  courierName: { type: String },
  deliveryAgentName: { type: String },
  deliveryAgentPhone: { type: String },
  estimatedDelivery: { type: Date },

  // Post-purchase
  cancellationReason: { type: String },
  returnStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'rejected', 'refunded'],
    default: 'none'
  },
  returnReason: { type: String },
  refundAmount: { type: Number },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date }
  }
}, { timestamps: true });

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ customerEmail: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
