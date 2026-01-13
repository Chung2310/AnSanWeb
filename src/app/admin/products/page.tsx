'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/hooks/use-products';
import { DataTable } from '@/components/admin/products/data-table';
import { columns } from '@/components/admin/products/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useState, useMemo, useCallback } from 'react';
import type { Category } from '@/lib/types';
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

  const getDescendantIds = useCallback((parentId: string, allCategories: Category[]): string[] => {
    const descendantIds: string[] = [];
    const queue: string[] = [parentId];
    const visited: Set<string> = new Set();
    
    // Find the initial parent category object to check its slug as well
    const parentCategory = allCategories.find(cat => cat.id === parentId);
    if(parentCategory) {
       visited.add(parentCategory.id);
       if(parentCategory.slug) {
         visited.add(parentCategory.slug);
       }
    }


    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      const children = allCategories.filter(cat => cat.parentId === currentId);
      for (const child of children) {
        if (!visited.has(child.id)) {
          descendantIds.push(child.id);
          if (child.slug) {
            descendantIds.push(child.slug);
          }
          queue.push(child.id);
          visited.add(child.id);
        }
      }
    }
    return descendantIds;
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products || !categories) {
      return [];
    }
    if (selectedCategoryId === 'all') {
      return products;
    }
    
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    if (!selectedCategory) return products;

    const allChildIds = getDescendantIds(selectedCategoryId, categories);
    const categoryIdsToFilter = [selectedCategoryId, selectedCategory.slug, ...allChildIds].filter(Boolean);
    
    return products.filter((p) => 
      p.tags?.some(tagId => categoryIdsToFilter.includes(tagId))
    );

  }, [products, categories, selectedCategoryId, getDescendantIds]);

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
                {categories?.filter(c => !c.parentId).map((cat) => (
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
