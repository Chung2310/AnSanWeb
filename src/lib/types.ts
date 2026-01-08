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
  howToEnjoy?: string;
  foodPairing?: string;
  storage?: string;
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
  slug: string;
  price: number;
  priceDescription?: string;
  secondaryPrice?: number;
  secondaryPriceDescription?: string;
  description: string;
  image: ImageInfo | null; // Cover Image
  detailImages?: ImageInfo[]; // Detail Page Images
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: string[];
  attributes: ProductAttribute[];
  categoryIds?: string[];
  createdAt?: any;
  status: 'published' | 'draft';
  // Denormalized fields for filtering
  age?: number;
  cask?: string;
  nonChillFiltered?: boolean;
};

// Combined type for convenience when working with full product data
export type FullProduct = Product;


export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: ImageInfo | null;
  status: 'active' | 'inactive';
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
