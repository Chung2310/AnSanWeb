
export type ImageInfo = {
  url: string;
  path: string;
  imageUrl?: string;
  imageHint?: string;
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

export type ProductAttribute = {
  label: string;
  value: string;
};

export type Wine = {
  id: string;
  nameVN: string;
  nameEN: string;
  slug: string;
  price: number;
  description: string;
  image: ImageInfo | null;
  detailImage?: ImageInfo | null;
  tastingNotes?: TastingNotes;
  productDetails?: ProductDetails;
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: string[];
  attributes: ProductAttribute[];
  createdAt?: string;
  age?: number;
  cask?: string;
  nonChillFiltered?: boolean;
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
  content: string;
  date: string;
  image: {
    imageUrl: string;
    imageHint: string;
    path?: string;
  } | null;
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
