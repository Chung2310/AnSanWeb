'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/admin/categories/data-table';
import { columns } from '@/components/admin/categories/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';

export default function CategoriesAdminPage() {
    const { categories, isLoading } = useCategories();

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Danh mục sản phẩm</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm danh mục mới
          </Link>
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={categories || []} />
      </div>
    </div>
  );
}
