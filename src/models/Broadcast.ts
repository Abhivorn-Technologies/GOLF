import mongoose from 'mongoose';

const BroadcastSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  discountCode: { type: String, default: '' },
  message: { type: String, required: true },
  targetAudience: { 
    type: String, 
    enum: ['all', 'subscribers_only'], 
    default: 'all' 
  },
  recipientCount: { type: Number, required: true, default: 0 },
  recipientEmails: [{ type: String }],
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  sentBy: { type: String, default: 'Admin' }
}, { timestamps: true });

export default mongoose.models.Broadcast || mongoose.model('Broadcast', BroadcastSchema);
