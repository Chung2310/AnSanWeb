

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

export type ProductStructuredDetails = {
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

// Represents core data for product listings
export type Product = {
  id: string;
  nameVN: string;
  nameEN: string;
  slug: string;
  price: number;
  image: ImageInfo | null;
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: string[];
  attributes: ProductAttribute[];
  createdAt?: any;
  status: 'published' | 'draft';
  // Denormalized fields for filtering
  age?: number;
  cask?: string;
  nonChillFiltered?: boolean;
};

// Represents extended data for the product detail page
export type ProductDetail = {
  id: string; // Must match the ID in the 'products' collection
  description: string;
  detailImage?: ImageInfo | null;
  tastingNotes?: TastingNotes | null;
  productDetails?: ProductStructuredDetails | null;
};

// Combined type for convenience when working with full product data
export type FullProduct = Product & Partial<ProductDetail>;


export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: ImageInfo | null;
  status: 'active' | 'inactive';
  createdAt: string;
};

export type BlogPost = {
  id: string;
  author: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
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

    
    
