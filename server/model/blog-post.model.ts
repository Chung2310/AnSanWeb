import { Schema, model } from 'mongoose';
import { IBlogPost } from '../interface/blog-post.interface.ts';

const ImageInfoSchema = new Schema(
  {
    url: { type: String, required: true },
    path: { type: String },
    imageHint: { type: String },
  },
  { _id: false }
);

const BlogPostSchema = new Schema<IBlogPost>(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
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
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    image: {
      type: ImageInfoSchema,
      default: null,
    },
    categories: {
      type: [String],
      default: [],
      index: true,
    },
    date: {
      type: String,
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

export const BlogPostModel = model<IBlogPost>('BlogPost', BlogPostSchema);
