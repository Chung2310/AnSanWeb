'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useUploadStorage } from '@/hooks/use-upload-storage';
import { Progress } from '@/components/ui/progress';
import slugify from 'slugify';
import { useState } from 'react';
import RichTextEditor from './rich-text-editor';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: 'Tiêu đề phải có ít nhất 2 ký tự.' }),
  slug: z.string().min(2, { message: 'Slug phải có ít nhất 2 ký tự.' }),
  author: z.string().min(2, { message: 'Tên tác giả là bắt buộc.' }),
  excerpt: z.string().min(10, { message: 'Mô tả ngắn phải có ít nhất 10 ký tự.' }),
  content: z.string().optional(),
  image: z
    .object({
      imageUrl: z.string(),
      path: z.string().optional(),
      imageHint: z.string().optional(),
    })
    .nullable(),
  categories: z.array(z.string()),
});

type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  initialData?: BlogPost;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { startUpload, progress, isUploading } = useUploadStorage();
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image?.imageUrl || null);
  const [categoriesInput, setCategoriesInput] = useState(initialData?.categories.join(', ') || '');

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          content: initialData.content || '',
        }
      : {
          title: '',
          slug: '',
          author: 'AnSan',
          excerpt: '',
          content: '',
          image: null,
          categories: [],
        },
  });
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    const slug = slugify(title, { lower: true, strict: true, locale: 'vi' });
    form.setValue('slug', slug);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const imageInfo = await startUpload(file, 'blog');
        if (imageInfo) {
          form.setValue('image', { imageUrl: imageInfo.url, path: imageInfo.path });
          setImagePreview(imageInfo.url);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Lỗi tải lên',
          description: 'Không thể tải ảnh lên. Vui lòng thử lại.',
        });
        setImagePreview(null);
      }
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      const processedData = {
          ...data,
          content: data.content || '',
          categories: categoriesInput.split(',').map(c => c.trim().toUpperCase()).filter(Boolean),
      };

      if (initialData && initialData.id) {
        const postRef = doc(firestore, 'blogPosts', initialData.id);
        await updateDoc(postRef, {
            ...processedData,
            date: serverTimestamp(), // Use server timestamp to update the date
        });
        toast({ title: 'Thành công', description: 'Bài viết đã được cập nhật.' });
      } else {
        const collectionRef = collection(firestore, 'blogPosts');
        const newDocRef = doc(collectionRef); // Create a reference with an ID first
        
        await setDoc(newDocRef, {
            ...processedData,
            id: newDocRef.id,
            date: serverTimestamp(),
        });

        toast({ title: 'Thành công', description: 'Bài viết đã được tạo.' });
      }
      router.back();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Đã có lỗi xảy ra',
        description: 'Không thể lưu bài viết. Vui lòng thử lại.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Nội dung bài viết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Vd: Cách phân biệt Scotch và Bourbon"
                          {...field}
                          onChange={handleTitleChange}
                        />
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
                      <FormLabel>Đường dẫn (Slug)</FormLabel>
                      <FormControl>
                        <Input placeholder="cach-phan-biet-scotch-va-bourbon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả ngắn (Excerpt)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Một mô tả ngắn gọn về bài viết..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Xem trước ảnh"
                        width={200}
                        height={150}
                        className="w-full rounded-md object-cover aspect-video"
                      />
                       <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6"
                        onClick={() => {
                          setImagePreview(null);
                          form.setValue('image', null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel htmlFor="image-upload" className="cursor-pointer">
                            <div className="flex items-center justify-center border-2 border-dashed p-4 text-center text-muted-foreground hover:bg-accent">
                                <Upload className="mr-2 h-4 w-4" />
                                <span>{isUploading ? 'Đang tải lên...' : 'Tải ảnh lên'}</span>
                            </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="image-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </FormControl>
                        {isUploading && <Progress value={progress} />}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Tác giả & Phân loại</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tác giả</FormLabel>
                        <FormControl>
                            <Input placeholder="Tên tác giả" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <FormControl>
                           <Input 
                            placeholder="Vd: NEWS, WHISKY BASICS" 
                            value={categoriesInput}
                            onChange={(e) => setCategoriesInput(e.target.value)}
                           />
                        </FormControl>
                         <FormMessage />
                    </FormItem>
              </CardContent>
            </Card>
          </div>
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? 'Đang lưu...'
            : initialData
            ? 'Cập nhật bài viết'
            : 'Tạo bài viết'}
        </Button>
      </form>
    </Form>
  );
}
