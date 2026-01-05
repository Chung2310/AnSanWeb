'use client';
import { sampleWines } from "@/lib/placeholder-data";
import ProductListing from "@/components/product-listing";

export default function ProductsPage() {
  const products = sampleWines.filter(wine => wine.price < 20000000);

  return (
    <ProductListing 
      initialProducts={products}
      title="Whisky Dưới 20 Triệu"
    />
  );
}
