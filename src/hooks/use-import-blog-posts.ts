'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import slugify from 'slugify';

export function useImportBlogPosts() {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const importBlogPosts = async (file: File) => {
    setIsImporting(true);
    toast({ title: 'Bắt đầu nhập bài viết...', description: 'Quá trình này có thể mất vài phút.' });

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const blogPostsArray: any[] = [];
      let processedCount = 0;
      let skippedCount = 0;

      for (const row of jsonData) {
        const title = row['Tiêu đề'];
        if (!title) {
          console.warn('Skipping row due to missing title:', row);
          skippedCount++;
          continue;
        }

        const blogId = row['ID'] ? String(row['ID']) : undefined;

        const blogData: any = {
          title: title,
          slug: row['Đường dẫn (slug)'] || slugify(title, { lower: true, strict: true, locale: 'vi' }),
          author: row['Tác giả'] || 'AnSan',
          excerpt: row['Mô tả ngắn'] || '',
          content: row['Nội dung'] || '',
          image: row['URL Ảnh'] ? { url: row['URL Ảnh'], path: '' } : null,
          categories: row['Danh mục'] ? String(row['Danh mục']).split(',').map((c: string) => c.trim().toUpperCase()).filter(Boolean) : [],
        };

        if (blogId) {
          blogData.id = blogId;
          blogData._id = blogId;
        }

        if (row['Ngày tạo']) {
          try {
            blogData.createdAt = new Date(row['Ngày tạo']);
          } catch (e) {}
        }
        
        blogPostsArray.push(blogData);
        processedCount++;
      }

      await apiClient.post('/blog-posts/bulk', blogPostsArray);

      toast({
        title: 'Nhập hoàn tất!',
        description: `${processedCount} bài viết đã được xử lý. ${skippedCount} bài viết bị bỏ qua.`,
      });

    } catch (error) {
      console.error('Error importing blog posts:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi nhập dữ liệu',
        description: (error as Error).message || 'Không thể xử lý tệp Excel. Vui lòng kiểm tra lại định dạng.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return { importBlogPosts, isImporting };
}
