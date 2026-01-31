'use client';

import { useForm, useFieldArray, type Control } from 'react-hook-form';
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
import { wineMegaMenuData, spiritsMegaMenuData } from '@/lib/mega-menu-data';

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
  preselectedCategoryId?: string | null;
}

const renderCheckboxGroup = (control: Control<ProductFormValues>, title: string, items: { label: string; category_id: string }[]) => {
    if (!items || items.length === 0) return null;
    return (
        <div key={title}>
            <h4 className="font-semibold text-gray-700 mb-3 mt-5 border-b pb-2">{title}</h4>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-3">
                {items.map(item => (
                    <FormField
                        key={item.category_id}
                        control={control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.category_id)}
                                        onCheckedChange={(checked) => {
                                            const currentTags = field.value || [];
                                            const newTags = checked
                                                ? [...currentTags, item.category_id]
                                                : currentTags.filter(value => value !== item.category_id);
                                            field.onChange(newTags);
                                        }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal text-sm -translate-y-0.5">{item.label}</FormLabel>
                            </FormItem>
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

const renderWineMegaMenuSelectors = (control: Control<ProductFormValues>) => {
    return (
        <>
            {renderCheckboxGroup(control, "Theo loại", wineMegaMenuData.theoLoai)}
            {renderCheckboxGroup(control, "Theo quốc gia", wineMegaMenuData.theoQuocGia)}
            {renderCheckboxGroup(control, "Theo vùng", wineMegaMenuData.theoVung)}
            {renderCheckboxGroup(control, "Theo giống nho", wineMegaMenuData.theoGiongNho)}
        </>
    );
};

const renderSpiritsMegaMenuSelectors = (control: Control<ProductFormValues>) => {
    return (
        <>
            {renderCheckboxGroup(control, "Theo loại rượu", spiritsMegaMenuData.theoLoai)}
            {renderCheckboxGroup(control, "Thương hiệu", spiritsMegaMenuData.thuongHieu)}
        </>
    );
};

export default function ProductForm({ initialData, preselectedCategoryId }: ProductFormProps) {
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
          tags: preselectedCategoryId ? [preselectedCategoryId] : [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes',
  });
  
  const watchedTags = form.watch('tags');

  const mainCategories = useMemo(() => {
    if (!categories) return [];
    const slugs = ['ruou-vang', 'ruou-manh', 'ly-coc-pha-le', 'bo-qua-tang'];
    return slugs.map(slug => categories.find(c => c.slug === slug)).filter((c): c is Category => !!c);
  }, [categories]);

  const currentMainCategoryId = useMemo(() => {
    const currentTags = watchedTags || [];
    const mainCategory = mainCategories.find(mc => currentTags.includes(mc.id));
    return mainCategory?.id;
  }, [watchedTags, mainCategories]);

  const handleMainCategoryChange = (selectedId: string) => {
      const currentTags = form.getValues('tags') || [];
      const mainCategoryIds = mainCategories.map(mc => mc.id);

      // Remove all main category IDs from current tags
      const otherTags = currentTags.filter(tag => !mainCategoryIds.includes(tag));

      // Add the newly selected main category ID if it's not 'none'
      const newTags = selectedId && selectedId !== 'none' ? [...otherTags, selectedId] : otherTags;

      form.setValue('tags', newTags, { shouldDirty: true });
  };

  const wineCategoryIds = useMemo(() => {
    if (isLoadingCategories || !categories) {
        return new Set<string>();
    }
    const wineCat = categories.find(c => c.slug === 'ruou-vang');
    if (!wineCat) {
        return new Set<string>();
    }
    
    const allIds = new Set<string>();
    const queue: string[] = [wineCat.id];
    
    while(queue.length > 0) {
        const currentId = queue.shift()!;
        if (!allIds.has(currentId)) {
            allIds.add(currentId);
            const children = categories.filter(c => c.parentId === currentId);
            children.forEach(child => queue.push(child.id));
        }
    }
    return allIds;
  }, [categories, isLoadingCategories]);

  const isWineForm = useMemo(() => {
      if (wineCategoryIds.size === 0) return false;
      const currentTags = watchedTags || [];
      return currentTags.some(tagId => wineCategoryIds.has(tagId));
  }, [wineCategoryIds, watchedTags]);

  const spiritCategoryIds = useMemo(() => {
    if (isLoadingCategories || !categories) return new Set<string>();
    const spiritCat = categories.find(c => c.slug === 'ruou-manh');
    if (!spiritCat) return new Set<string>();
    
    const allIds = new Set<string>();
    const queue: string[] = [spiritCat.id];
    
    while(queue.length > 0) {
        const currentId = queue.shift()!;
        if (!allIds.has(currentId)) {
            allIds.add(currentId);
            const children = categories.filter(c => c.parentId === currentId);
            children.forEach(child => queue.push(child.id));
        }
    }
    return allIds;
  }, [categories, isLoadingCategories]);

  const isSpiritForm = useMemo(() => {
      if (spiritCategoryIds.size === 0) return false;
      const currentTags = watchedTags || [];
      return currentTags.some(tagId => spiritCategoryIds.has(tagId));
  }, [spiritCategoryIds, watchedTags]);

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
        const finalData: Partial<FullProduct> = { ...data };

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

        (finalData as any).updatedAt = serverTimestamp();
        
        if (initialData) {
            const productId = initialData.id;
            delete (finalData as any).id;

            const productRef = doc(firestore, 'products', productId);
            await updateDoc(productRef, finalData);
            toast({ title: 'Thành công', description: 'Sản phẩm đã được cập nhật.' });
        } else {
            delete (finalData as any).id;
            (finalData as any).createdAt = serverTimestamp();
            const collectionRef = collection(firestore, 'products');
            const newDoc = await addDoc(collectionRef, finalData as FullProduct);
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
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base">Danh mục chính</FormLabel>
                      <Select
                        value={currentMainCategoryId || 'none'}
                        onValueChange={handleMainCategoryChange}
                        disabled={isLoadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục chính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Không có</SelectItem>
                          {mainCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                          Chọn danh mục chính cho sản phẩm.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {isWineForm && (
              <Card>
                <CardHeader>
                    <CardTitle>Phân loại Rượu Vang</CardTitle>
                    <CardDescription>Chọn các thẻ phân loại chi tiết cho sản phẩm rượu vang.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-72">
                        <div className="pr-4">
                            {renderWineMegaMenuSelectors(form.control)}
                        </div>
                    </ScrollArea>
                </CardContent>
              </Card>
            )}

            {isSpiritForm && (
              <Card>
                <CardHeader>
                    <CardTitle>Phân loại Rượu Mạnh</CardTitle>
                    <CardDescription>Chọn các thẻ phân loại chi tiết cho sản phẩm rượu mạnh.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-72">
                        <div className="pr-4">
                            {renderSpiritsMegaMenuSelectors(form.control)}
                        </div>
                    </ScrollArea>
                </CardContent>
              </Card>
            )}
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
