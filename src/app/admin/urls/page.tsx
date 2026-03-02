'use client';

import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { useBlogPosts } from '@/hooks/use-blog-posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type UrlItem = {
  title: string;
  path: string;
  type: 'Sản phẩm' | 'Danh mục' | 'Bài viết' | 'Trang tĩnh';
};

const STATIC_URLS: UrlItem[] = [
  { title: 'Trang chủ', path: '/', type: 'Trang tĩnh' },
  { title: 'Tất cả sản phẩm', path: '/danh-muc-san-pham', type: 'Trang tĩnh' },
  { title: 'Sản phẩm giá tốt', path: '/collection/gia-tot', type: 'Trang tĩnh' },
  { title: 'Tin tức & Kiến thức', path: '/tin-tuc', type: 'Trang tĩnh' },
  { title: 'Giới thiệu', path: '/gioi-thieu', type: 'Trang tĩnh' },
  { title: 'Liên hệ', path: '/lien-he', type: 'Trang tĩnh' },
  { title: 'Trắc nghiệm rượu vang', path: '/trac-nghiem-ruou-vang', type: 'Trang tĩnh' },
];

export default function UrlsAdminPage() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { blogPosts, isLoading: isLoadingBlogs } = useBlogPosts();
  const { toast } = useToast();
  const [searchTerm, setSearchQuery] = useState('');

  const allUrls = useMemo(() => {
    const urls: UrlItem[] = [...STATIC_URLS];

    categories?.forEach((cat) => {
      urls.push({
        title: cat.name,
        path: `/danh-muc/${cat.slug}`,
        type: 'Danh mục',
      });
    });

    products?.forEach((prod) => {
      urls.push({
        title: prod.nameVN,
        path: `/san-pham/${prod.slug}`,
        type: 'Sản phẩm',
      });
    });

    blogPosts?.forEach((post) => {
      urls.push({
        title: post.title,
        path: `/tin-tuc/${post.slug}`,
        type: 'Bài viết',
      });
    });

    return urls;
  }, [products, categories, blogPosts]);

  const filteredUrls = useMemo(() => {
    if (!searchTerm) return allUrls;
    const lower = searchTerm.toLowerCase();
    return allUrls.filter(
      (u) =>
        u.title.toLowerCase().includes(lower) || u.path.toLowerCase().includes(lower)
    );
  }, [allUrls, searchTerm]);

  const copyToClipboard = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: 'Đã sao chép!',
      description: `Đường dẫn đã được lưu vào bộ nhớ tạm.`,
    });
  };

  const isLoading = isLoadingProducts || isLoadingCategories || isLoadingBlogs;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Quản lý đường dẫn (URLs)</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đường dẫn hoặc tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách ({filteredUrls.length} kết quả)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                  <th className="pb-4 pt-0">Loại</th>
                  <th className="pb-4 pt-0">Tiêu đề / Tên</th>
                  <th className="pb-4 pt-0">Đường dẫn (Path)</th>
                  <th className="pb-4 pt-0 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUrls.map((item, idx) => (
                  <tr key={idx} className="border-b transition-colors hover:bg-muted/50">
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-semibold">{item.title}</td>
                    <td className="py-4 text-sm font-mono text-muted-foreground">{item.path}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(item.path)}
                          title="Sao chép URL tuyệt đối"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Xem trang">
                          <a href={item.path} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUrls.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted-foreground">
                      Không tìm thấy đường dẫn nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
