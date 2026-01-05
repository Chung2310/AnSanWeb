'use client';
import { sampleWines } from "@/lib/placeholder-data";
import ProductListing from "@/components/product-listing";

export default function ProductsPage() {
  return (
    <ProductListing 
      initialProducts={sampleWines}
      title="Tất cả sản phẩm"
    />
  );
}
