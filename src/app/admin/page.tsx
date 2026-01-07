'use client';

import { useProducts } from '@/hooks/use-products';
import { sampleBlogPosts } from '@/lib/placeholder-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Package, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { blogPosts, isLoading: isLoadingBlogs } = { blogPosts: sampleBlogPosts, isLoading: false }; // Assuming you'll have a useBlogPosts hook

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Sản Phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingProducts ? '...' : products?.length || 0}
            </div>
            <Link href="/admin/products" className="text-xs text-muted-foreground hover:underline">
              Xem tất cả sản phẩm
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Bài Viết</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingBlogs ? '...' : blogPosts?.length || 0}
            </div>
             <Link href="/admin/blog" className="text-xs text-muted-foreground hover:underline">
              Xem tất cả bài viết
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1</div>
            <p className="text-xs text-muted-foreground">
              (Chỉ có admin)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
