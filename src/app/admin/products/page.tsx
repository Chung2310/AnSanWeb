'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/hooks/use-products';
import { DataTable } from '@/components/admin/products/data-table';
import { columns } from '@/components/admin/products/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Category } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { wineMegaMenuData } from '@/lib/mega-menu-data';

export default function ProductsAdminPage() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedGrape, setSelectedGrape] = useState<string>('all');

  const wineCategory = useMemo(() => {
    if (!categories) return null;
    return categories.find(c => c.slug === 'ruou-vang');
  }, [categories]);

  const isWineCategorySelected = selectedCategoryId === wineCategory?.id;

  // Reset sub-filters when main category is no longer wine
  useEffect(() => {
    if (!isWineCategorySelected) {
        setSelectedCountry('all');
        setSelectedGrape('all');
    }
  }, [isWineCategorySelected]);


  const getDescendantIds = useCallback((parentId: string, allCategories: Category[]): string[] => {
    const descendantIds: string[] = [];
    const queue: string[] = [parentId];
    const visited: Set<string> = new Set();
    
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
    
    let tempProducts = [...products];

    // 1. Filter by main category
    if (selectedCategoryId !== 'all') {
      const selectedCategory = categories.find(c => c.id === selectedCategoryId);
      if (selectedCategory) {
        const allChildIds = getDescendantIds(selectedCategoryId, categories);
        const categoryIdsToFilter = [selectedCategoryId, selectedCategory.slug, ...allChildIds].filter(Boolean);
        tempProducts = tempProducts.filter((p) => 
          p.tags?.some(tagId => categoryIdsToFilter.includes(tagId))
        );
      }
    }

    // 2. If wine category is selected, apply sub-filters
    if (isWineCategorySelected) {
        if (selectedCountry !== 'all') {
            tempProducts = tempProducts.filter(p => p.tags?.includes(selectedCountry));
        }
        if (selectedGrape !== 'all') {
            tempProducts = tempProducts.filter(p => p.tags?.includes(selectedGrape));
        }
    }
    
    return tempProducts;

  }, [products, categories, selectedCategoryId, getDescendantIds, isWineCategorySelected, selectedCountry, selectedGrape]);

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
        <div className="flex items-center flex-wrap justify-end gap-4">
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

            {isWineCategorySelected && (
              <>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Lọc theo quốc gia" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả quốc gia</SelectItem>
                        {wineMegaMenuData.theoQuocGia.map((country) => (
                            <SelectItem key={country.category_id} value={country.category_id}>
                                {country.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedGrape} onValueChange={setSelectedGrape}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Lọc theo giống nho" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả giống nho</SelectItem>
                        {wineMegaMenuData.theoGiongNho.map((grape) => (
                            <SelectItem key={grape.category_id} value={grape.category_id}>
                                {grape.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </>
            )}

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
