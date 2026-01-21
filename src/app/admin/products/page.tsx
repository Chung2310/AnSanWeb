'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { wineMegaMenuData } from '@/lib/mega-menu-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Define a type for wine filters
type WineFilters = {
  theoLoai: string[];
  theoQuocGia: string[];
  theoVung: string[];
  theoGiongNho: string[];
};


export default function ProductsAdminPage() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  
  // New state for detailed wine filters
  const [wineFilters, setWineFilters] = useState<WineFilters>({
    theoLoai: [],
    theoQuocGia: [],
    theoVung: [],
    theoGiongNho: [],
  });

  const mainProductCategories = useMemo(() => {
    if (!categories) return [];
    const slugs = ['ruou-vang', 'ruou-manh', 'ly-coc-pha-le', 'bo-qua-tang'];
    // Preserve order
    return slugs.map(slug => categories.find(c => c.slug === slug)).filter((c): c is Category => !!c);
  }, [categories]);

  const wineCategory = useMemo(() => {
    if (!categories) return null;
    return categories.find(c => c.slug === 'ruou-vang');
  }, [categories]);

  const isWineCategorySelected = selectedCategoryId === wineCategory?.id;

  // Reset sub-filters when main category is no longer wine
  useEffect(() => {
    if (!isWineCategorySelected) {
        setWineFilters({ theoLoai: [], theoQuocGia: [], theoVung: [], theoGiongNho: [] });
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

    // 2. If wine category is selected, apply detailed wine filters
    if (isWineCategorySelected) {
      const { theoLoai, theoQuocGia, theoVung, theoGiongNho } = wineFilters;

      const hasActiveFilter = theoLoai.length > 0 || theoQuocGia.length > 0 || theoVung.length > 0 || theoGiongNho.length > 0;

      if (hasActiveFilter) {
          tempProducts = tempProducts.filter(p => {
              const productTags = new Set(p.tags || []);
              
              const matchLoai = theoLoai.length === 0 || theoLoai.some(tag => productTags.has(tag));
              const matchQuocGia = theoQuocGia.length === 0 || theoQuocGia.some(tag => productTags.has(tag));
              const matchVung = theoVung.length === 0 || theoVung.some(tag => productTags.has(tag));
              const matchGiongNho = theoGiongNho.length === 0 || theoGiongNho.some(tag => productTags.has(tag));
              
              return matchLoai && matchQuocGia && matchVung && matchGiongNho;
          });
      }
    }
    
    return tempProducts;

  }, [products, categories, selectedCategoryId, getDescendantIds, isWineCategorySelected, wineFilters]);

  const isLoading = isLoadingProducts || isLoadingCategories;
  
  const handleWineFilterChange = (group: keyof WineFilters, tagId: string, checked: boolean) => {
    setWineFilters(prev => {
        const currentGroup = prev[group];
        const newGroup = checked 
            ? [...currentGroup, tagId] 
            : currentGroup.filter(item => item !== tagId);
        return { ...prev, [group]: newGroup };
    });
  };

  const clearWineFilters = () => {
      setWineFilters({ theoLoai: [], theoQuocGia: [], theoVung: [], theoGiongNho: [] });
  }

  const renderFilterGroup = (title: string, groupKey: keyof WineFilters, items: { label: string, slug: string, category_id: string }[]) => (
    <div className='mb-4'>
        <h4 className='font-semibold mb-2 text-lg border-b pb-2'>{title}</h4>
        <div className="grid grid-cols-2 gap-2 mt-2">
            {items.map(item => (
                <div key={item.category_id} className="flex items-center space-x-2">
                    <Checkbox
                        id={`${groupKey}-${item.category_id}`}
                        checked={wineFilters[groupKey].includes(item.category_id)}
                        onCheckedChange={(checked) => handleWineFilterChange(groupKey, item.category_id, !!checked)}
                    />
                    <Label htmlFor={`${groupKey}-${item.category_id}`} className='font-normal cursor-pointer'>
                        {item.label}
                    </Label>
                </div>
            ))}
        </div>
    </div>
  );


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
              <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Lọc Rượu Vang
                    </Button>
                </SheetTrigger>
                <SheetContent className='w-full sm:max-w-md'>
                    <SheetHeader>
                        <SheetTitle>Bộ lọc Rượu Vang</SheetTitle>
                        <SheetDescription>
                            Tinh chỉnh danh sách rượu vang theo các tiêu chí dưới đây.
                        </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-150px)] mt-4">
                        <div className='pr-6'>
                            {renderFilterGroup('Theo loại rượu', 'theoLoai', wineMegaMenuData.theoLoai)}
                            {renderFilterGroup('Theo Quốc Gia', 'theoQuocGia', wineMegaMenuData.theoQuocGia)}
                            {renderFilterGroup('Theo vùng', 'theoVung', wineMegaMenuData.theoVung)}
                            {renderFilterGroup('Theo giống nho', 'theoGiongNho', wineMegaMenuData.theoGiongNho)}
                        </div>
                    </ScrollArea>
                    <SheetFooter className="mt-4 gap-2 sm:justify-between">
                         <Button type="button" variant="secondary" onClick={clearWineFilters}>Xóa bộ lọc</Button>
                         <SheetClose asChild>
                            <Button type="button">Áp dụng</Button>
                         </SheetClose>
                    </SheetFooter>
                </SheetContent>
              </Sheet>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Thêm sản phẩm mới
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {mainProductCategories.map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild>
                        <Link href={`/admin/products/new?categoryId=${cat.id}`}>
                            {cat.name}
                        </Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={filteredProducts || []} />
      </div>
    </div>
  );
}
