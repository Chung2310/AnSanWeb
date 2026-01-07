'use client';
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import FileUploader from './file-uploader';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  nameVN: z.string().min(2, "Tên tiếng Việt phải có ít nhất 2 ký tự."),
  nameEN: z.string().min(2, "Tên tiếng Anh phải có ít nhất 2 ký tự."),
  slug: z.string().min(2, "Slug phải có ít nhất 2 ký tự."),
  price: z.coerce.number().min(0, "Giá phải là số dương."),
  image: z.object({
    url: z.string().url("URL ảnh không hợp lệ."),
    path: z.string(),
  }).nullable(),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  tags: z.string().optional(),
  attributes: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
}).refine(data => data.image, {
    message: "Vui lòng tải lên một ảnh đại diện.",
    path: ["image"],
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    productId?: string;
}

const ProductFormSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );

export default function ProductForm({ productId }: ProductFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();

  const isEditMode = productId !== 'new' && !!productId;

  const productRef = useMemoFirebase(
    () => (isEditMode ? doc(firestore, 'products', productId) : null),
    [isEditMode, firestore, productId]
  );
  
  const { data: defaultValues, isLoading: isLoadingProduct } = useDoc<Product>(productRef);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameVN: '',
      nameEN: '',
      slug: '',
      price: 0,
      image: null,
      isFeatured: false,
      isNew: true,
      tags: '',
      attributes: [],
    },
  });

  useEffect(() => {
    if (isEditMode && defaultValues) {
        form.reset({
          ...defaultValues,
          tags: defaultValues.tags?.join(', '),
          price: defaultValues.price || 0,
          image: defaultValues.image || null,
        });
      } else {
        form.reset({
            nameVN: '',
            nameEN: '',
            slug: '',
            price: 0,
            image: null,
            isFeatured: false,
            isNew: true,
            tags: '',
            attributes: [],
        });
      }
  }, [isEditMode, defaultValues, form]);


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('nameVN', name);
    if (!form.formState.dirtyFields.slug) {
        const slug = name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        form.setValue('slug', slug);
    }
  };


  const onSubmit = async (values: ProductFormValues) => {
    try {
      const dataToSave = {
        ...values,
        tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
      };

      if (isEditMode) {
        if (!productId) throw new Error('Product ID is missing for update.');
        const productDocRef = doc(firestore, 'products', productId);
        await updateDoc(productDocRef, {
            ...dataToSave,
            updatedAt: serverTimestamp(),
        });
        toast({ title: 'Thành công', description: 'Đã cập nhật sản phẩm.' });
      } else {
        await addDoc(collection(firestore, 'products'), {
            ...dataToSave,
            id: '', // Firestore will generate it, but we need to satisfy the type
            createdAt: serverTimestamp(),
        });
        toast({ title: 'Thành công', description: 'Đã tạo sản phẩm mới.' });
      }
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: 'destructive',
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu sản phẩm. Vui lòng thử lại.',
      });
    }
  };

  if (isLoadingProduct) {
    return <ProductFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Ảnh đại diện</FormLabel>
                          <FormControl>
                              <FileUploader 
                                  fieldName="image"
                                  onFieldChange={field.onChange}
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
                  />

              <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                      control={form.control}
                      name="nameVN"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Tên sản phẩm (VN)</FormLabel>
                          <FormControl>
                              <Input placeholder="Vd: The Macallan 18" {...field} onChange={handleNameChange} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="nameEN"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Tên sản phẩm (EN)</FormLabel>
                          <FormControl>
                              <Input placeholder="E.g., The Macallan 18" {...field} />
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
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                              <Input placeholder="vd: the-macallan-18" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Giá</FormLabel>
                          <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                          <Textarea placeholder="Nhập các tag, cách nhau bởi dấu phẩy" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
              />

              <div className="grid grid-cols-2 gap-4">
                  <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                  <FormLabel>Nổi bật</FormLabel>
                              </div>
                              <FormControl>
                                  <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                  />
                              </FormControl>
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="isNew"
                      render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                  <FormLabel>Sản phẩm mới</FormLabel>
                              </div>
                              <FormControl>
                                  <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                  />
                              </FormControl>
                          </FormItem>
                      )}
                  />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
                  Hủy
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
