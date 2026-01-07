'use client'

import ProductForm from "@/components/admin/products/product-form";
import { useParams } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const { productId } = params;

    return (
        <div>
            <ProductForm productId={productId as string} />
        </div>
    )
}
