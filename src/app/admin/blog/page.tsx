
'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, FileUp } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/admin/blog/data-table';
import { columns } from '@/components/admin/blog/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlogPosts } from '@/hooks/use-blog-posts';
import { useImportBlogPosts } from '@/hooks/use-import-blog-posts';
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

export default function BlogAdminPage() {
    const { blogPosts, isLoading } = useBlogPosts();
    const { importBlogPosts, isImporting } = useImportBlogPosts();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleExport = () => {
        if (!blogPosts || blogPosts.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Không có dữ liệu',
                description: 'Không có bài viết nào để xuất.',
            });
            return;
        }

        const dataToExport = blogPosts.map(post => ({
            'ID': post.id,
            'Tiêu đề': post.title,
            'Tác giả': post.author,
            'Đường dẫn (slug)': post.slug,
            'Mô tả ngắn': post.excerpt,
            'Nội dung': post.content || '',
            'URL Ảnh': post.image?.url || '',
            'Danh mục': (post.categories || []).join(','),
            'Ngày tạo': post.createdAt ? (typeof post.createdAt.toDate === 'function' ? post.createdAt.toDate().toISOString() : new Date(post.createdAt).toISOString()) : '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "BlogPosts");
        XLSX.writeFile(workbook, `bai-viet-${new Date().getTime()}.xlsx`);
    };

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Bài viết</h1>
        <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
            >
                <FileUp className="mr-2 h-4 w-4" />
                {isImporting ? 'Đang nhập...' : 'Nhập Excel'}
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        await importBlogPosts(file);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                }}
            />
            <Button asChild size="sm">
                <Link href="/admin/blog/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm bài viết mới
                </Link>
            </Button>
        </div>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={blogPosts || []} />
      </div>
    </div>
  );
}
