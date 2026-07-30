import { Document } from 'mongoose';

export interface IImageInfo {
  url: string;
  path?: string;
  imageHint?: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: IImageInfo | null;
  status: 'active' | 'inactive';
  parentId?: string | null;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
