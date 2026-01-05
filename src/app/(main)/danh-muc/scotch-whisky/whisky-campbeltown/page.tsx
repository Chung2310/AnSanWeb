'use client';
import { sampleWines } from "@/lib/placeholder-data";
import ProductListing from "@/components/product-listing";
import { categoryData } from "@/lib/category-data";

export default function ProductsPage() {
  const products = sampleWines.filter(wine => wine.tags?.includes('campbeltown'));
  const bannerData = categoryData.find(cat => cat.slug === 'whisky-campbeltown');

  return (
    <ProductListing 
      initialProducts={products}
      title="Whisky Campbeltown"
      bannerData={bannerData}
    />
  );
}
