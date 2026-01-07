'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBlogDialog } from '@/components/admin/blog/use-blog-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import FileUploader from '@/components/admin/products/file-uploader';
import type { ImageInfo } from '@/lib/types';
import { Loader2 } from 'lucide-react';


const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  author: z.string().min(1, 'Tác giả là bắt buộc'),
  excerpt: z.string().min(1, 'Mô tả ngắn là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  image: z.object({
    imageUrl: z.string().min(1, "URL ảnh bìa là bắt buộc"),
    imageHint: z.string().optional(),
    path: z.string().optional(),
  }).nullable(),
  categories: z.string().min(1, 'Phải có ít nhất một danh mục'),
});

function generateSlug(name: string) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/đ/g, 'd') 
    .replace(/[^a-z0-9\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-'); 
}


export function BlogForm() {
  const { isOpen, onClose, defaultValues, id } = useBlogDialog();
  const firestore = useFirestore();
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const titleValue = form.watch('title');
  const { isSubmitting } = form.formState;

  const handleUploadStateChange = useCallback((isUploading: boolean) => {
    setIsUploading(isUploading);
  }, []);

  useEffect(() => {
    if (titleValue && !isEditMode) {
      const slug = generateSlug(titleValue);
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [titleValue, form, isEditMode]);


  useEffect(() => {
    if (isOpen) {
        if (defaultValues) {
            form.reset({
                ...defaultValues,
                categories: defaultValues.categories?.join(', ') || '',
            });
        } else {
            form.reset({
                title: '',
                slug: '',
                author: 'AnSan',
                excerpt: '',
                content: '',
                image: null,
                categories: '',
            });
        }
    }
}, [defaultValues, form, isOpen]);
  
  const handleImageUploadComplete = useCallback((imageInfo: ImageInfo) => {
    form.setValue('image', { imageUrl: imageInfo.url, path: imageInfo.path, imageHint: '' }, { shouldValidate: true });
  }, [form]);


  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;

    const postsCollectionRef = collection(firestore, 'blogPosts');
    
    const submissionData = {
        ...values,
        categories: values.categories.split(',').map(cat => cat.trim().toUpperCase()).filter(Boolean),
        date: new Date().toISOString(),
    };

    if (isEditMode && id) {
      const docRef = doc(postsCollectionRef, id);
      // When updating, we might not want to change the date, or handle it differently
      const { date, ...updateData } = submissionData;
      updateDocumentNonBlocking(docRef, updateData);
    } else {
      addDocumentNonBlocking(postsCollectionRef, submissionData);
    }
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Chỉnh sửa' : 'Thêm'} Bài Viết</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Chỉnh sửa bài viết "${defaultValues?.title}".`
              : 'Thêm một bài viết mới vào trang kiến thức.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4"
          >
            <div className="md:col-span-2 space-y-4">
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tiêu đề</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Đánh giá chi tiết: The Macallan 18..." />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="danh-gia-chi-tiet-the-macallan-18" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tác giả</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục (phân cách bằng dấu phẩy)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="WHISKY REVIEW, NEWS" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="md:col-span-1">
                <FileUploader
                    fieldName="image"
                    label="Ảnh bìa"
                    onUploadComplete={handleImageUploadComplete}
                    defaultUrl={form.getValues('image.imageUrl')}
                    onUploadStateChange={handleUploadStateChange}
                />
            </div>
            
            <div className="md:col-span-3">
               <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn (Excerpt)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Một đoạn tóm tắt ngắn gọn về bài viết..."
                        className='min-h-[100px]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-3">
               <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Nội dung chi tiết của bài viết..."
                        className='min-h-[250px]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="md:col-span-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu Thay Đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
