'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Product, Category } from '@/lib/types';
import { useCategories } from '@/hooks/use-categories';
import { Trash, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useUploadStorage } from '@/hooks/use-upload-storage';
import { Progress } from '@/components/ui/progress';
import {
  doc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import {
  setDocumentNonBlocking,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import slugify from 'slugify';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  nameVN: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  slug: z.string().min(2, { message: 'Slug phải có ít nhất 2 ký tự.' }),
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive('Giá phải là số dương.')),
  description: z.string().optional(),
  image: z
    .object({
      url: z.string(),
      path: z.string(),
    })
    .nullable(),
  status: z.enum(['published', 'draft']),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  categoryIds: z.array(z.string()).optional(),
  attributes: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { startUpload, progress, isUploading } = useUploadStorage();
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image?.url || null);
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: String(initialData.price),
          categoryIds: initialData.categoryIds || [],
          tags: initialData.tags || [],
        }
      : {
          nameVN: '',
          slug: '',
          price: '0',
          description: '',
          image: null,
          status: 'published',
          isFeatured: false,
          isNew: true,
          categoryIds: [],
          attributes: [],
          tags: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes',
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('nameVN', name);
    form.setValue('slug', slugify(name, { lower: true, strict: true }));
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
        const imageInfo = await startUpload(file, 'products');
        if (imageInfo) {
          form.setValue('image', imageInfo);
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


  const onSubmit = async (data: ProductFormValues) => {
    try {
      const tags = tagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
      
      const processedData = {
        ...data,
        nameEN: data.nameVN, 
        price: Number(data.price),
        tags: tags,
        createdAt: initialData?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (initialData) {
        const productRef = doc(firestore, 'products', initialData.id);
        updateDocumentNonBlocking(productRef, processedData);
        toast({ title: 'Thành công', description: 'Sản phẩm đã được cập nhật.' });
      } else {
        const collectionRef = collection(firestore, 'products');
        addDocumentNonBlocking(collectionRef, processedData);
        toast({ title: 'Thành công', description: 'Sản phẩm đã được tạo.' });
      }
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Đã có lỗi xảy ra',
        description: 'Không thể lưu sản phẩm. Vui lòng thử lại.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nameVN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Vd: The Macallan 18"
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
                        <Input placeholder="the-macallan-18" {...field} />
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả ngắn</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả về sản phẩm..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle>Thuộc tính</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name={`attributes.${index}.label`}
                        render={({ field }) => (
                          <FormItem className='flex-1'>
                            <FormLabel>Nhãn</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Vd: Xuất xứ" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name={`attributes.${index}.value`}
                        render={({ field }) => (
                           <FormItem className='flex-1'>
                            <FormLabel>Giá trị</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Vd: Scotland" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ label: '', value: '' })}
                  >
                    Thêm thuộc tính
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Xem trước ảnh"
                        width={200}
                        height={200}
                        className="w-full rounded-md object-contain"
                      />
                       <Button
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
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái hiển thị</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
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
                      <div className="space-y-0.5">
                        <FormLabel>Nổi bật</FormLabel>
                        <FormDescription>
                          Hiển thị trên trang chủ.
                        </FormDescription>
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
                         <FormDescription>
                          Gắn nhãn "Mới".
                        </FormDescription>
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
                          <FormLabel>Danh mục chính</FormLabel>
                          {isLoadingCategories ? <p>Đang tải...</p> : (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {(categories || []).map((category: Category) => (
                                      <FormField
                                        key={category.id}
                                        control={form.control}
                                        name="categoryIds"
                                        render={({ field }) => (
                                           <FormItem
                                            key={category.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(category.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value || [], category.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== category.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {category.name}
                                            </FormLabel>
                                          </FormItem>
                                        )}
                                      />
                                  ))}
                              </div>
                          )}
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormDescription>Phân cách các tag bằng dấu phẩy (,)</FormDescription>
                    <FormControl>
                        <Input 
                        placeholder="Vd: scotch, old-rare, islay" 
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              </CardContent>
            </Card>
          </div>
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
          {isUploading ? 'Đang tải ảnh...' : form.formState.isSubmitting
            ? 'Đang lưu...'
            : initialData
            ? 'Cập nhật sản phẩm'
            : 'Tạo sản phẩm'}
        </Button>
      </form>
    </Form>
  );
}
