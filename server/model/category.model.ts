import { Schema, model } from 'mongoose';
import { ICategory } from '../interface/category.interface.ts';

const CategorySchema = new Schema<ICategory>(
  {
    name: {
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
    description: {
      type: String,
      trim: true,
    },
    image: {
      url: { type: String, default: '' },
      path: { type: String, default: '' },
      imageHint: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    parentId: {
      type: String,
      default: null,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        if (doc._id) {
          (ret as any).id = doc._id.toString();
        }
        return ret;
      }
    },
    toObject: { virtuals: true },
  }
);

export const CategoryModel = model<ICategory>('Category', CategorySchema);
