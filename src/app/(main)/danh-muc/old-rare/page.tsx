'use client';
import { sampleWines } from "@/lib/placeholder-data";
import ProductListing from "@/components/product-listing";

export default function ProductsPage() {
  const products = sampleWines.filter(wine => wine.tags?.includes('old-rare'));

  return (
    <ProductListing 
      initialProducts={products}
      title="Old & Rare"
    />
  );
}
