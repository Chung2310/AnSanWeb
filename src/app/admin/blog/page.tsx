'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/admin/blog/data-table';
import { columns } from '@/components/admin/blog/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlogPosts } from '@/hooks/use-blog-posts';

export default function BlogAdminPage() {
    const { blogPosts, isLoading } = useBlogPosts();

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
        <h1 className="text-3xl font-bold">Bài viết</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm bài viết mới
          </Link>
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={blogPosts || []} />
      </div>
    </div>
  );
}
