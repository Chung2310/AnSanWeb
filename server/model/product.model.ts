import { Schema, model } from 'mongoose';
import { IProduct } from '../interface/product.interface.ts';

const ProductAttributeSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ImageInfoSchema = new Schema(
  {
    url: { type: String, required: true },
    path: { type: String },
    imageHint: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    nameVN: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDescription: {
      type: String,
      trim: true,
    },
    secondaryPrice: {
      type: Number,
      default: null,
    },
    secondaryPriceDescription: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: ImageInfoSchema,
      default: null,
    },
    detailImages: {
      type: [ImageInfoSchema],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    bestChoice: {
      type: Boolean,
      default: false,
    },
    isGoodPrice: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    attributes: {
      type: [ProductAttributeSchema],
      default: [],
    },
    categoryIds: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    age: {
      type: Number,
    },
    cask: {
      type: String,
      trim: true,
    },
    nonChillFiltered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        (ret as any).id = doc._id.toString();
        return ret;
      }
    },
    toObject: { virtuals: true },
  }
);

export const ProductModel = model<IProduct>('Product', ProductSchema);
