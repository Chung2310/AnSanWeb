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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/types';
import slugify from 'slugify';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCategories } from '@/hooks/use-categories';
import RichTextEditor from '@/components/admin/blog/rich-text-editor';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  slug: z.string().min(2, { message: 'Slug phải có ít nhất 2 ký tự.' }),
  parentId: z.string().nullable().optional(),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: Category;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const firestore = useFirestore();
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          description: initialData.description || '',
        }
      : {
          name: '',
          slug: '',
          parentId: null,
          description: '',
        },
  });
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' });
    if (slug) {
        form.setValue('slug', slug);
    }
  };

  const getRedirectUrl = () => {
    const page = searchParams.get('page');
    return page ? `/admin/categories?page=${page}` : '/admin/categories';
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const processedData = {
        ...data,
        parentId: data.parentId || null,
        description: data.description || '',
      };

      if (initialData && initialData.id) {
        const docRef = doc(firestore, 'categories', initialData.id);
        await updateDoc(docRef, processedData);
        toast({ title: 'Thành công', description: 'Danh mục đã được cập nhật.' });
      } else {
        const collectionRef = collection(firestore, 'categories');
        const newDocRef = doc(collectionRef); // Create a reference to get the ID first
        
        await setDoc(newDocRef, {
            ...processedData,
            id: newDocRef.id, // Add the generated ID to the document data
        });
        toast({ title: 'Thành công', description: 'Danh mục đã được tạo.' });
      }
      router.push(getRedirectUrl());
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        variant: 'destructive',
        title: 'Đã có lỗi xảy ra',
        description: 'Không thể lưu danh mục. Vui lòng thử lại.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin danh mục</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Vd: Vang Ý"
                      {...field}
                      onChange={handleNameChange}
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
                    <Input placeholder="vang-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục cha</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                    value={field.value || 'none'}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục cha (nếu có)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Không có</SelectItem>
                      {categories?.filter(c => c.id !== initialData?.id).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả danh mục (Nội dung SEO)</FormLabel>
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
        <div className="flex items-center gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? 'Đang lưu...'
                : initialData
                ? 'Cập nhật'
                : 'Tạo danh mục'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(getRedirectUrl())}>
                Hủy
            </Button>
        </div>
      </form>
    </Form>
  );
}
