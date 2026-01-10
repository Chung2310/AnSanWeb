'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/hooks/use-products';
import { DataTable } from '@/components/admin/products/data-table';
import { columns } from '@/components/admin/products/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProductsAdminPage() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }
    if (selectedCategoryId === 'all') {
      return products;
    }
    return products.filter((p) => p.tags?.includes(selectedCategoryId));
  }, [products, selectedCategoryId]);

  const isLoading = isLoadingProducts || isLoadingCategories;

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <div className="flex items-center gap-4">
           <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm sản phẩm mới
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={filteredProducts || []} />
      </div>
    </div>
  );
}
