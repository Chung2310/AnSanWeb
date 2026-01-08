'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { sampleBlogPosts } from '@/lib/placeholder-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Package, FileText } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { blogPosts, isLoading: isLoadingBlogs } = { blogPosts: sampleBlogPosts, isLoading: false };
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.tags?.includes(selectedCategory));
  }, [products, selectedCategory]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Lọc sản phẩm theo danh mục:</span>
          {isLoadingCategories ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories?.map(cat => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Sản Phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingProducts ? '...' : filteredProducts.length}
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
