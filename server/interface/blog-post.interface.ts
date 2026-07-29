import { Document } from 'mongoose';
import { IImageInfo } from './category.interface.ts';

export interface IBlogPost extends Document {
  author: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image?: IImageInfo | null;
  categories?: string[];
  date?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
