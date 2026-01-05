'use client';
import { sampleWines } from "@/lib/placeholder-data";
import ProductListing from "@/components/product-listing";

export default function ProductsPage() {
  const products = sampleWines.filter(wine => wine.tags?.includes('gift-set'));

  return (
    <ProductListing 
      initialProducts={products}
      title="Bộ Quà Tặng"
    />
  );
}
