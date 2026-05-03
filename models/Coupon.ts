import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
}

const CouponSchema: Schema<ICoupon> = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percent', 'fixed'], required: true, default: 'percent' },
  value: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, min: 0 },
  usageLimit: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0, min: 0 },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
