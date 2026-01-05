'use client';
import { sampleWines } from "@/lib/placeholder-data";
import ProductListing from "@/components/product-listing";

export default function ProductsPage() {
  const products = sampleWines.filter(wine => wine.tags?.includes('tasting-set'));

  return (
    <ProductListing 
      initialProducts={products}
      title="Set Thử Rượu"
    />
  );
}
