import type { ImagePlaceholder } from './placeholder-images';

export type Wine = {
  id: string;
  nameVN: string;
  nameEN: string;
  slug: string;
  price: number;
  origin: string;
  type: 'Vang Đỏ' | 'Vang Trắng' | 'Vang Hồng' | 'Vang Sủi' | 'Vang Tráng Miệng' | 'Whisky' | 'Gift Set' | 'Tasting Set' | 'Armagnac';
  alcohol: number;
  description: string;
  image: ImagePlaceholder;
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: ImagePlaceholder;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: ImagePlaceholder;
};

export type Testimonial = {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatar: ImagePlaceholder;
};
