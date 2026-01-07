'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/hooks/use-products';
import { DataTable } from '@/components/admin/products/data-table';
import { columns } from '@/components/admin/products/columns';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsAdminPage() {
  const { products, isLoading } = useProducts();

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
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm sản phẩm mới
          </Link>
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={products || []} />
      </div>
    </div>
  );
}
