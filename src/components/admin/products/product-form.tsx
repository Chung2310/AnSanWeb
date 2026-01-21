

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
  CardDescription,
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
import { useRouter, useSearchParams } from 'next/navigation';
import type { FullProduct, ImageInfo, Category } from '@/lib/types';
import { Trash, X, Upload } from 'lucide-react';
import Image from 'next/image';
import {
  doc,
  collection,
  serverTimestamp,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import slugify from 'slugify';
import { useState, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategories } from '@/hooks/use-categories';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUploadStorage } from '@/hooks/use-upload-storage';
import { Progress } from '@/components/ui/progress';
import { wineMegaMenuData } from '@/lib/mega-menu-data';

const productAttributeSchema = z.object({
  label: z.string().min(1, 'Nhãn không được để trống'),
  value: z.string().min(1, 'Giá trị không được để trống'),
});

const imageInfoSchema = z.object({
    url: z.string(),
    path: z.string().optional(),
});

const formSchema = z.object({
  id: z.string().optional(),
  nameVN: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  slug: z.string().min(2, { message: 'Slug phải có ít nhất 2 ký tự.' }),
  shortDescription: z.string().optional(),
  price: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : parseFloat(String(val))),
    z.number({ required_error: "Giá là bắt buộc."}).positive({ message: 'Giá phải là số dương.' })
  ),
  priceDescription: z.string().optional(),
  secondaryPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : parseFloat(String(val))),
    z.number().positive('Giá phải là số dương.').optional()
  ),
  secondaryPriceDescription: z.string().optional(),
  description: z.string().optional(),
  image: imageInfoSchema.nullable(),
  detailImages: z.array(imageInfoSchema).optional(),
  status: z.enum(['published', 'draft']),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  attributes: z.array(productAttributeSchema).optional(),
  tags: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: FullProduct;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const firestore = useFirestore();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { startUpload, progress, isUploading } = useUploadStorage();
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(initialData?.image?.url || null);
  const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>(initialData?.detailImages?.map(img => img.url) || []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          shortDescription: initialData.shortDescription || '',
          description: initialData.description || '',
          attributes: initialData.attributes || [],
          tags: initialData.tags || [],
          priceDescription: initialData.priceDescription || '',
          secondaryPrice: initialData.secondaryPrice || undefined,
          secondaryPriceDescription: initialData.secondaryPriceDescription || '',
          image: initialData.image ? { url: initialData.image.url, path: initialData.image.path || '' } : null,
          detailImages: initialData.detailImages || [],
        }
      : {
          nameVN: '',
          slug: '',
          shortDescription: '',
          price: '' as any,
          priceDescription: '',
          secondaryPrice: '' as any,
          secondaryPriceDescription: '',
          description: '',
          image: null,
          detailImages: [],
          status: 'published',
          isFeatured: false,
          isNew: true,
          attributes: [],
          tags: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes',
  });
  
  const categoryTree = useMemo(() => {
    if (!categories) return [];
    const map: { [key: string]: Category & { children: Category[] } } = {};
    const roots: (Category & { children: Category[] })[] = [];

    categories.forEach(cat => {
      map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
      if (cat.parentId && map[cat.parentId]) {
        map[cat.parentId].children.push(map[cat.id]);
      } else {
        roots.push(map[cat.id]);
      }
    });

    return roots;
  }, [categories]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('nameVN', name);
    form.setValue('slug', slugify(name, { lower: true, strict: true }));
  };
  
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));
      try {
        const imageInfo = await startUpload(file, 'products');
        if (imageInfo) {
          form.setValue('image', { url: imageInfo.url, path: imageInfo.path });
          setCoverImagePreview(imageInfo.url);
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Lỗi tải lên', description: 'Không thể tải ảnh bìa.' });
        setCoverImagePreview(null);
      }
    }
  };

  const handleDetailImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setDetailImagePreviews(prev => [...prev, ...newPreviews]);

      const uploadPromises = Array.from(files).map(file => startUpload(file, 'products/details'));
      
      try {
        const uploadedImages = await Promise.all(uploadPromises);
        const currentImages = form.getValues('detailImages') || [];
        form.setValue('detailImages', [...currentImages, ...uploadedImages.filter((img): img is ImageInfo => !!img)]);
        setDetailImagePreviews(form.getValues('detailImages')?.map(img => img.url) || []);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Lỗi tải lên', description: 'Không thể tải lên một hoặc nhiều ảnh chi tiết.' });
      }
    }
  };

  const removeDetailImage = (index: number) => {
    const currentImages = form.getValues('detailImages') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue('detailImages', newImages);
    setDetailImagePreviews(newImages.map(img => img.url));
  };

  const getRedirectUrl = () => {
    const page = searchParams.get('page');
    return page ? `/admin/products?page=${page}` : '/admin/products';
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
        const finalData = { ...data } as any;

        // Convert prices to numbers, handle empty strings
        finalData.price = Number(data.price);
        if (data.secondaryPrice) {
            finalData.secondaryPrice = Number(data.secondaryPrice);
        } else {
            delete finalData.secondaryPrice; // Remove field if empty
        }
        
        if(!data.secondaryPriceDescription) {
            delete finalData.secondaryPriceDescription;
        }

        finalData.updatedAt = serverTimestamp();
        
        if (initialData) {
            const productId = initialData.id;
            delete finalData.id;

            const productRef = doc(firestore, 'products', productId);
            await updateDoc(productRef, finalData);
            toast({ title: 'Thành công', description: 'Sản phẩm đã được cập nhật.' });
        } else {
            delete finalData.id;
            finalData.createdAt = serverTimestamp();
            const collectionRef = collection(firestore, 'products');
            const newDoc = await addDoc(collectionRef, finalData);
            await updateDoc(newDoc, { id: newDoc.id });
            toast({ title: 'Thành công', description: 'Sản phẩm đã được tạo.' });
        }
        router.push(getRedirectUrl());
    } catch (error) {
        console.error("Error saving product:", error);
        toast({
            variant: 'destructive',
            title: 'Đã có lỗi xảy ra',
            description: 'Không thể lưu sản phẩm. Vui lòng thử lại.',
        });
    }
  };
  
    const renderCategoryCheckboxes = (categories: (Category & { children: Category[] })[], level = 0) => {
        return categories.map(category => (
            <div key={category.id} style={{ marginLeft: `${level * 1.5}rem` }}>
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 my-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), category.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                    (value) => value !== category.id
                                                )
                                            );
                                    }}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">{category.name}</FormLabel>
                        </FormItem>
                    )}
                />
                {category.children.length > 0 && renderCategoryCheckboxes(category.children, level + 1)}
            </div>
        ));
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle>Thông tin cơ bản</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="nameVN" render={({ field }) => (<FormItem><FormLabel>Tên sản phẩm</FormLabel><FormControl><Input placeholder="Vd: The Macallan 18" {...field} onChange={handleNameChange} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Đường dẫn (Slug)</FormLabel><FormControl><Input placeholder="the-macallan-18" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="shortDescription" render={({ field }) => (<FormItem><FormLabel>Mô tả ngắn gọn</FormLabel><FormControl><Textarea placeholder="Mô tả ngắn gọn, hấp dẫn về sản phẩm..." {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />

                <Card>
                  <CardHeader><CardTitle className="text-lg">Giá sản phẩm</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <FormItem>
                      <FormLabel>Giá chính</FormLabel>
                      <FormDescription>Giá mặc định của sản phẩm.</FormDescription>
                      <div className="flex gap-4 mt-2">
                        <FormField control={form.control} name="price" render={({ field }) => (<FormItem className="flex-1"><FormControl><Input type="number" placeholder="800000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="priceDescription" render={({ field }) => (<FormItem className="flex-1"><FormControl><Input placeholder="Vd: / điếu" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    </FormItem>
                     <FormItem>
                      <FormLabel>Giá phụ (Tùy chọn)</FormLabel>
                      <FormDescription>Sử dụng cho các tùy chọn mua khác, ví dụ: giá mỗi hộp.</FormDescription>
                      <div className="flex gap-4 mt-2">
                        <FormField control={form.control} name="secondaryPrice" render={({ field }) => (<FormItem className="flex-1"><FormControl><Input type="number" placeholder="8000000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="secondaryPriceDescription" render={({ field }) => (<FormItem className="flex-1"><FormControl><Input placeholder="Vd: / hộp 10 điếu" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    </FormItem>
                  </CardContent>
                </Card>

                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Mô tả chi tiết</FormLabel><FormControl><Textarea placeholder="Mô tả chi tiết về sản phẩm..." {...field} rows={15} /></FormControl><FormMessage /></FormItem>)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Thuộc tính (Hiển thị nhanh)</CardTitle></CardHeader>
              <CardContent>
                <div>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 mb-4">
                      <FormField control={form.control} name={`attributes.${index}.label`} render={({ field }) => (<FormItem className='flex-1'><FormLabel>Nhãn</FormLabel><FormControl><Input {...field} placeholder="Vd: Xuất xứ" /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`attributes.${index}.value`} render={({ field }) => (<FormItem className='flex-1'><FormLabel>Giá trị</FormLabel><FormControl><Input {...field} placeholder="Vd: Scotland" /></FormControl></FormItem>)} />
                      <Button type="button" variant="destructive" onClick={() => remove(index)}><Trash className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => append({ label: '', value: '' })}>Thêm thuộc tính</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>Ảnh bìa</CardTitle>
                    <CardDescription>Ảnh đại diện cho sản phẩm ở trang danh sách.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {coverImagePreview && (
                        <div className="relative">
                        <Image src={coverImagePreview} alt="Xem trước ảnh bìa" width={200} height={200} className="w-full rounded-md object-contain aspect-square" />
                        <Button variant="destructive" size="icon" className="absolute right-2 top-2 h-6 w-6" onClick={() => { setCoverImagePreview(null); form.setValue('image', null); }}>
                            <X className="h-4 w-4" />
                        </Button>
                        </div>
                    )}
                    <FormField control={form.control} name="image" render={() => (
                        <FormItem>
                            <FormLabel htmlFor="cover-image-upload" className="cursor-pointer">
                                <div className="flex items-center justify-center border-2 border-dashed p-4 text-center text-muted-foreground hover:bg-accent">
                                    <Upload className="mr-2 h-4 w-4" />
                                    <span>{isUploading ? 'Đang tải...' : 'Tải ảnh bìa'}</span>
                                </div>
                            </FormLabel>
                            <FormControl>
                                <Input id="cover-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleCoverImageUpload} disabled={isUploading} />
                            </FormControl>
                            {isUploading && progress > 0 && <Progress value={progress} />}
                            <FormMessage />
                        </FormItem>
                    )} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ảnh trang chi tiết</CardTitle>
                    <CardDescription>Các ảnh bổ sung hiển thị trên trang chi tiết sản phẩm.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                        {detailImagePreviews.map((previewUrl, index) => (
                            <div key={index} className="relative">
                                <Image src={previewUrl} alt={`Xem trước ảnh chi tiết ${index + 1}`} width={100} height={100} className="w-full rounded-md object-contain aspect-square"/>
                                <Button variant="destructive" size="icon" className="absolute right-1 top-1 h-5 w-5" onClick={() => removeDetailImage(index)}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                        </div>
                         <FormField control={form.control} name="detailImages" render={() => (
                            <FormItem>
                                <FormLabel htmlFor="detail-images-upload" className="cursor-pointer">
                                    <div className="flex items-center justify-center border-2 border-dashed p-4 text-center text-muted-foreground hover:bg-accent">
                                        <Upload className="mr-2 h-4 w-4" />
                                        <span>{isUploading ? 'Đang tải...' : 'Thêm ảnh chi tiết'}</span>
                                    </div>
                                </FormLabel>
                                <FormControl>
                                    <Input id="detail-images-upload" type="file" className="sr-only" accept="image/*" multiple onChange={handleDetailImagesUpload} disabled={isUploading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </CardContent>
            </Card>


            <Card>
              <CardHeader><CardTitle>Trạng thái & Phân loại</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái hiển thị</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="published">Đã xuất bản</SelectItem>
                          <SelectItem value="draft">Bản nháp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="isFeatured" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel>Nổi bật</FormLabel><FormDescription>Hiển thị trên trang chủ.</FormDescription></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )} />
                 <FormField control={form.control} name="isNew" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel>Sản phẩm mới</FormLabel><FormDescription>Gắn nhãn "Mới".</FormDescription></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                 )} />
                
                <FormItem>
                    <div className="mb-4">
                        <FormLabel className='text-base'>Danh mục</FormLabel>
                        <FormDescription>
                          Chọn các danh mục phù hợp cho sản phẩm này.
                        </FormDescription>
                    </div>
                    <ScrollArea className="h-48 rounded-md border">
                        <div className="p-4">
                            {isLoadingCategories ? (
                                <p>Đang tải danh mục...</p>
                            ) : (
                                renderCategoryCheckboxes(categoryTree)
                            )}
                        </div>
                    </ScrollArea>
                    <FormMessage />
                </FormItem>

                <FormItem>
                    <div className="mb-4">
                        <FormLabel className='text-base'>Phân loại theo quốc gia</FormLabel>
                        <FormDescription>
                            Chọn quốc gia của sản phẩm rượu vang.
                        </FormDescription>
                    </div>
                    <ScrollArea className="h-48 rounded-md border">
                        <div className="p-4">
                            {wineMegaMenuData.theoQuocGia.map((item) => (
                                <FormField
                                    key={item.category_id}
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 my-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.category_id)}
                                                    onCheckedChange={(checked) => {
                                                        const currentTags = field.value || [];
                                                        return checked
                                                            ? field.onChange([...currentTags, item.category_id])
                                                            : field.onChange(currentTags.filter((value) => value !== item.category_id));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                    <FormMessage />
                </FormItem>

                <FormItem>
                    <div className="mb-4">
                        <FormLabel className='text-base'>Phân loại theo giống nho</FormLabel>
                        <FormDescription>
                            Chọn giống nho của sản phẩm rượu vang.
                        </FormDescription>
                    </div>
                    <ScrollArea className="h-48 rounded-md border">
                        <div className="p-4 grid grid-cols-2">
                            {wineMegaMenuData.theoGiongNho.map((item) => (
                                <FormField
                                    key={item.category_id}
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 my-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.category_id)}
                                                    onCheckedChange={(checked) => {
                                                        const currentTags = field.value || [];
                                                        return checked
                                                            ? field.onChange([...currentTags, item.category_id])
                                                            : field.onChange(currentTags.filter((value) => value !== item.category_id));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                    <FormMessage />
                </FormItem>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(getRedirectUrl())}>
                Hủy
            </Button>
        </div>
      </form>
    </Form>
  );
}
