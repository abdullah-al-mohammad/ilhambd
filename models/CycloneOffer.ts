import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICycloneOffer extends Document {
  isActive: boolean;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CycloneOfferSchema: Schema<ICycloneOffer> = new Schema({
  isActive: { type: Boolean, default: false },
  endTime: { type: Date, required: true },
}, { timestamps: true });

const CycloneOffer: Model<ICycloneOffer> =
  mongoose.models.CycloneOffer || mongoose.model<ICycloneOffer>('CycloneOffer', CycloneOfferSchema);

export default CycloneOffer;
