import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  soldPercentage?: number;
  stock: number;
  category: string;
  subcategory?: string;
  image?: string;
  images: string[];
  isFeatured: boolean;
  discountPercent: number;
  flashSalePrice?: number;
  flashSaleEndsAt?: Date;
  isCycloneOffer?: boolean;
  cyclonePrice?: number;
  colors: string[];
  sizes: string[];
  isDisabled?: boolean;
  createdAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  soldPercentage: { type: Number, min: 0, max: 100, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  subcategory: { type: String },
  image: { type: String },
  images: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  discountPercent: { type: Number, min: 0, max: 100, default: 0 },
  flashSalePrice: { type: Number },
  flashSaleEndsAt: { type: Date },
  isCycloneOffer: { type: Boolean, default: false },
  cyclonePrice: { type: Number },
  colors: [{ type: String }],
  sizes: [{ type: String }],
  isDisabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
