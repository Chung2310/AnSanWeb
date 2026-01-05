'use client';
import { sampleWines } from "@/lib/placeholder-data";
import ProductListing from "@/components/product-listing";

export default function ProductsPage() {
  const products = sampleWines.filter(wine => wine.tags?.includes('speyside'));

  return (
    <ProductListing 
      initialProducts={products}
      title="Whisky Speyside"
    />
  );
}
