
'use client';
import { useEffect, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, runTransaction } from 'firebase/firestore';
import FileUploader from './file-uploader';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories } from '@/hooks/use-categories';
import { Checkbox } from '@/components/ui/checkbox';
import { X, PlusCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const formSchema = z.object({
  nameVN: z.string().min(2, "Tên tiếng Việt phải có ít nhất 2 ký tự."),
  nameEN: z.string().min(2, "Tên tiếng Anh phải có ít nhất 2 ký tự."),
  slug: z.string().min(2, "Slug phải có ít nhất 2 ký tự."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Giá phải là số dương."),
  image: z.object({
    url: z.string().url("URL ảnh không hợp lệ.").min(1, "Vui lòng tải lên một ảnh đại diện."),
    path: z.string(),
  }).nullable(),
  status: z.enum(['published', 'draft']).default('published'),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  categoryIds: z.array(z.string()).optional(),
  tags: z.string().optional(),
  attributes: z.array(z.object({
    label: z.string().min(1, 'Nhãn không được để trống'),
    value: z.string().min(1, 'Giá trị không được để trống'),
  })).optional(),
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
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
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
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const isEditMode = productId !== 'new' && !!productId;

  const productRef = useMemoFirebase(
    () => (isEditMode ? doc(firestore, 'products', productId) : null),
    [isEditMode, firestore, productId]
  );
  
  const { data: productData, isLoading: isLoadingProduct } = useDoc<Product>(productRef);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameVN: '',
      nameEN: '',
      slug: '',
      description: '',
      price: 0,
      image: null,
      status: 'published',
      isFeatured: false,
      isNew: true,
      categoryIds: [],
      tags: '',
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  useEffect(() => {
    if (isEditMode && productData) {
        form.reset({
          ...productData,
          tags: productData.tags?.join(', '),
          price: productData.price || 0,
          image: productData.image || null,
          categoryIds: productData.categoryIds || [],
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
            categoryIds: [],
            tags: '',
            attributes: [],
        });
      }
  }, [isEditMode, productData, form]);


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('nameVN', name);
    if (!form.formState.dirtyFields.slug) {
        const slug = name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        form.setValue('slug', slug);
    }
  };


  const onSubmit = async (values: ProductFormValues) => {
    if (!firestore) return;
    
    if (!values.image) {
        form.setError("image", { type: "manual", message: "Vui lòng tải lên một ảnh đại diện." });
        return;
    }
    
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
        const newProductRef = doc(collection(firestore, 'products'));
        await setDoc(newProductRef, {
            ...dataToSave,
            id: newProductRef.id,
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

  if (isLoadingProduct || isLoadingCategories) {
    return <ProductFormSkeleton />;
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{isEditMode ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</h1>
                    <p className="text-muted-foreground">
                        {isEditMode ? 'Cập nhật thông tin chi tiết cho sản phẩm này.' : 'Điền thông tin để tạo một sản phẩm mới.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
                    Hủy
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cơ bản</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Mô tả ngắn</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Mô tả ngắn gọn về sản phẩm..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Ảnh sản phẩm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
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
                        </CardContent>
                    </Card>
                     <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Thuộc tính</CardTitle>
                            <CardDescription>Thêm các thuộc tính cho sản phẩm như Xuất xứ, Nồng độ,...</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`attributes.${index}.label`}
                                        render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Nhãn</FormLabel>
                                            <FormControl>
                                            <Input {...field} placeholder="Vd: Xuất xứ" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`attributes.${index}.value`}
                                        render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Giá trị</FormLabel>
                                            <FormControl>
                                            <Input {...field} placeholder="Vd: Scotland" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ label: '', value: '' })}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Thêm thuộc tính
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Giá</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Giá sản phẩm (VND)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Phân loại</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="categoryIds"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Danh mục</FormLabel>
                                            <FormDescription>
                                                Chọn các danh mục cho sản phẩm này.
                                            </FormDescription>
                                        </div>
                                        {categories?.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="categoryIds"
                                                render={({ field }) => {
                                                    return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                    (value) => value !== item.id
                                                                    )
                                                                )
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {item.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
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
                                        <Input placeholder="vd: the-macallan-18" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Trạng thái</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái hiển thị</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Chọn một trạng thái" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="published">Đã xuất bản</SelectItem>
                                        <SelectItem value="draft">Bản nháp</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <FormLabel>Nổi bật</FormLabel>
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
                                        <FormLabel>Sản phẩm mới</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
      </Form>
    </FormProvider>
  );
}
