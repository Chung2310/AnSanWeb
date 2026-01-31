'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/admin/categories/data-table';
import { columns } from '@/components/admin/categories/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useState, useMemo } from 'react';
import type { Category } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CategoriesAdminPage() {
    const { categories, isLoading } = useCategories();
    const [filter, setFilter] = useState('all'); // 'all' or 'parents'
    
    const categoryMap = useMemo(() => {
      if (!categories) return new Map<string, string>();
      return new Map(categories.map(c => [c.id, c.name]));
    }, [categories]);
    
    const filteredCategories = useMemo(() => {
        if (!categories) return [];
        if (filter === 'parents') {
          return categories.filter(c => !c.parentId);
        }
        return categories;
    }, [categories, filter]);

  
    const memoizedColumns = useMemo(() => columns(categoryMap), [categoryMap]);


  if (isLoading && !categories) {
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Danh mục sản phẩm</h1>
         <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="parents">Chỉ danh mục cha</SelectItem>
                </SelectContent>
            </Select>
            <Button asChild>
            <Link href="/admin/categories/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm danh mục mới
            </Link>
            </Button>
        </div>
      </div>
      <div className="mt-6">
        <DataTable columns={memoizedColumns} data={filteredCategories} />
      </div>
    </div>
  );
}
