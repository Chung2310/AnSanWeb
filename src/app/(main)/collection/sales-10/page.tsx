'use client';
import { sampleWines } from "@/lib/placeholder-data";
import ProductListing from "@/components/product-listing";

export default function ProductsPage() {
  // Since we don't have a specific "on-sale" flag, 
  // we'll just show some featured products as a placeholder.
  const products = sampleWines.filter(wine => wine.isFeatured);

  return (
    <ProductListing 
      initialProducts={products}
      title="Giảm giá 10%"
    />
  );
}
