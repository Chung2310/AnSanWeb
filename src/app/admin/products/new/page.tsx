'use client';

import ProductForm from "@/components/admin/products/product-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NewProductPageContent() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tạo sản phẩm mới</h1>
            <ProductForm preselectedCategoryId={categoryId} />
        </div>
    );
}


export default function NewProductPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <NewProductPageContent />
        </Suspense>
    )
}
