import { Document } from 'mongoose';
import { IImageInfo } from './category.interface.ts';

export interface IProductAttribute {
  label: string;
  value: string;
}

export interface IProduct extends Document {
  nameVN: string;
  slug: string;
  shortDescription?: string;
  price: number;
  priceDescription?: string;
  secondaryPrice?: number | null;
  secondaryPriceDescription?: string | null;
  description: string;
  image?: IImageInfo | null;
  detailImages?: IImageInfo[];
  isFeatured?: boolean;
  isNew?: boolean;
  bestChoice?: boolean;
  isGoodPrice?: boolean;
  tags?: string[];
  attributes?: IProductAttribute[];
  categoryIds?: string[];
  status: 'published' | 'draft';
  age?: number;
  cask?: string;
  nonChillFiltered?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
