
export type ImageInfo = {
  url: string;
  path: string;
};

export type TastingNotes = {
  brand?: string;
  chillFiltered?: string;
  region?: string;
  caskType?: string;
  nose: string;
  palate: string;
  finish: string;
  color: string;
};

export type ProductDetails = {
  title: string;
  paragraphs: string[];
  details: { label: string; value: string }[];
  tastingNote: {
    nose: string;
    palate: string;
    finish: string;
  };
  conclusion: string;
};

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
  image: ImageInfo;
  detailImage?: ImageInfo;
  tastingNotes?: TastingNotes;
  productDetails?: ProductDetails;
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: string[];
  age?: number;
  cask?: string;
  nonChillFiltered?: boolean;
  createdAt?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: {
    imageUrl: string,
    imageHint: string
  };
};

export type BlogPost = {
  id: string;
  author: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  image: {
    imageUrl: string,
    imageHint: string,
  };
  categories: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatar: {
    imageUrl: string,
    imageHint: string,
  };
};
