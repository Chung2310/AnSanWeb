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
import type { Product, Category, FullProduct } from '@/lib/types';
import { useCategories } from '@/hooks/use-categories';
import { Trash, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useUploadStorage } from '@/hooks/use-upload-storage';
import { Progress } from '@/components/ui/progress';
import {
  doc,
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

const productAttributeSchema = z.object({
  label: z.string().min(1, 'Nhãn không được để trống'),
  value: z.string().min(1, 'Giá trị không được để trống'),
});

const tastingNotesSchema = z.object({
  brand: z.string().optional(),
  chillFiltered: z.string().optional(),
  region: z.string().optional(),
  caskType: z.string().optional(),
  color: z.string().min(1, 'Màu sắc là bắt buộc'),
  nose: z.string().min(1, 'Mùi hương là bắt buộc'),
  palate: z.string().min(1, 'Hương vị là bắt buộc'),
  finish: z.string().min(1, 'Hậu vị là bắt buộc'),
});

const productDetailsSchema = z.object({
  title: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  details: z.array(productAttributeSchema).optional(),
  tastingNote: z.object({
      nose: z.string().optional(),
      palate: z.string().optional(),
      finish: z.string().optional(),
    }).optional(),
  conclusion: z.string().optional(),
});


const formSchema = z.object({
  nameVN: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  nameEN: z.string().optional(),
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
  attributes: z.array(productAttributeSchema).optional(),
  tags: z.array(z.string()).optional(),
  tastingNotes: tastingNotesSchema.optional().nullable(),
  productDetails: productDetailsSchema.optional().nullable(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: FullProduct;
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
          nameVN: initialData.nameVN || '',
          nameEN: initialData.nameEN || '',
          slug: initialData.slug || '',
          description: initialData.description || '',
          price: String(initialData.price || '0'),
          image: initialData.image || null,
          status: initialData.status || 'draft',
          isFeatured: initialData.isFeatured || false,
          isNew: initialData.isNew || false,
          categoryIds: initialData.categoryIds || [],
          attributes: initialData.attributes || [],
          tags: initialData.tags || [],
          tastingNotes: {
            brand: initialData.tastingNotes?.brand || '',
            chillFiltered: initialData.tastingNotes?.chillFiltered || '',
            region: initialData.tastingNotes?.region || '',
            caskType: initialData.tastingNotes?.caskType || '',
            color: initialData.tastingNotes?.color || '',
            nose: initialData.tastingNotes?.nose || '',
            palate: initialData.tastingNotes?.palate || '',
            finish: initialData.tastingNotes?.finish || '',
          },
          productDetails: {
            title: initialData.productDetails?.title || '',
            paragraphs: initialData.productDetails?.paragraphs || [],
            details: initialData.productDetails?.details || [],
            tastingNote: {
                nose: initialData.productDetails?.tastingNote?.nose || '',
                palate: initialData.productDetails?.tastingNote?.palate || '',
                finish: initialData.productDetails?.tastingNote?.finish || '',
            },
            conclusion: initialData.productDetails?.conclusion || '',
          },
        }
      : {
          nameVN: '',
          nameEN: '',
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
          tastingNotes: {
            brand: '',
            region: '',
            caskType: '',
            chillFiltered: '',
            color: '',
            nose: '',
            palate: '',
            finish: '',
          },
          productDetails: {
            title: '',
            paragraphs: [],
            details: [],
            tastingNote: {
                nose: '',
                palate: '',
                finish: '',
            },
            conclusion: '',
          },
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes',
  });

  const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
    control: form.control,
    name: 'productDetails.details',
  });


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('nameVN', name);
    if (!form.getValues('slug')) {
      form.setValue('slug', slugify(name, { lower: true, strict: true }));
    }
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
      
      const mainProductData = {
        nameVN: data.nameVN,
        nameEN: data.nameEN || data.nameVN,
        slug: data.slug,
        price: Number(data.price),
        description: data.description || '',
        image: data.image,
        status: data.status,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        categoryIds: data.categoryIds || [],
        attributes: data.attributes || [],
        tags: tags,
        createdAt: initialData?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const detailData = {
        description: data.description || '', // This seems redundant, but let's keep for compatibility.
        tastingNotes: data.tastingNotes,
        productDetails: data.productDetails,
      };

      if (initialData) {
        const productRef = doc(firestore, 'products', initialData.id);
        const detailRef = doc(firestore, 'product_details', initialData.id);
        updateDocumentNonBlocking(productRef, mainProductData);
        setDocumentNonBlocking(detailRef, detailData, { merge: true });
        toast({ title: 'Thành công', description: 'Sản phẩm đã được cập nhật.' });
      } else {
        const collectionRef = collection(firestore, 'products');
        const newDocRef = await addDocumentNonBlocking(collectionRef, mainProductData);
        if (newDocRef) {
            const detailRef = doc(firestore, 'product_details', newDocRef.id);
            setDocumentNonBlocking(detailRef, detailData, { merge: true });
        }
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
              <CardHeader><CardTitle>Thông tin cơ bản</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="nameVN" render={({ field }) => (<FormItem><FormLabel>Tên sản phẩm (VN)</FormLabel><FormControl><Input placeholder="Vd: The Macallan 18" {...field} onChange={handleNameChange} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="nameEN" render={({ field }) => (<FormItem><FormLabel>Tên sản phẩm (EN)</FormLabel><FormControl><Input placeholder="Ex: The Macallan 18" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Đường dẫn (Slug)</FormLabel><FormControl><Input placeholder="the-macallan-18" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Giá</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Mô tả ngắn</FormLabel><FormControl><Textarea placeholder="Mô tả về sản phẩm..." {...field} /></FormControl><FormMessage /></FormItem>)} />
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

             <Card>
              <CardHeader><CardTitle>Ghi chú nếm thử (Tasting Notes)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="tastingNotes.brand" render={({ field }) => (<FormItem><FormLabel>Thương hiệu</FormLabel><FormControl><Input placeholder="Vd: The Macallan" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="tastingNotes.region" render={({ field }) => (<FormItem><FormLabel>Vùng</FormLabel><FormControl><Input placeholder="Vd: Speyside" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="tastingNotes.caskType" render={({ field }) => (<FormItem><FormLabel>Loại thùng</FormLabel><FormControl><Input placeholder="Vd: Sherry Oak" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="tastingNotes.chillFiltered" render={({ field }) => (<FormItem><FormLabel>Lọc lạnh</FormLabel><FormControl><Input placeholder="Vd: Không" {...field} /></FormControl></FormItem>)} />
                </div>
                <FormField control={form.control} name="tastingNotes.color" render={({ field }) => (<FormItem><FormLabel>Màu sắc</FormLabel><FormControl><Textarea placeholder="Mô tả màu sắc..." {...field} rows={2} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tastingNotes.nose" render={({ field }) => (<FormItem><FormLabel>Mùi hương (Nose)</FormLabel><FormControl><Textarea placeholder="Mô tả mùi hương..." {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tastingNotes.palate" render={({ field }) => (<FormItem><FormLabel>Hương vị (Palate)</FormLabel><FormControl><Textarea placeholder="Mô tả hương vị..." {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="tastingNotes.finish" render={({ field }) => (<FormItem><FormLabel>Hậu vị (Finish)</FormLabel><FormControl><Textarea placeholder="Mô tả hậu vị..." {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Mô tả chi tiết sản phẩm</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 <FormField control={form.control} name="productDetails.title" render={({ field }) => (<FormItem><FormLabel>Tiêu đề chính</FormLabel><FormControl><Input placeholder="Tiêu đề cho phần mô tả" {...field} /></FormControl></FormItem>)} />
                 <FormField control={form.control} name="productDetails.paragraphs.0" render={({ field }) => (<FormItem><FormLabel>Đoạn văn 1</FormLabel><FormControl><Textarea placeholder="Nội dung đoạn văn..." {...field} rows={4} /></FormControl></FormItem>)} />
                 <FormField control={form.control} name="productDetails.paragraphs.1" render={({ field }) => (<FormItem><FormLabel>Đoạn văn 2</FormLabel><FormControl><Textarea placeholder="Nội dung đoạn văn..." {...field} rows={4} /></FormControl></FormItem>)} />
                 
                 <FormLabel>Các chi tiết khác</FormLabel>
                 {detailFields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4">
                        <FormField control={form.control} name={`productDetails.details.${index}.label`} render={({ field }) => (<FormItem className='flex-1'><FormControl><Input {...field} placeholder="Nhãn" /></FormControl></FormItem>)} />
                        <FormField control={form.control} name={`productDetails.details.${index}.value`} render={({ field }) => (<FormItem className='flex-1'><FormControl><Input {...field} placeholder="Giá trị" /></FormControl></FormItem>)} />
                        <Button type="button" variant="destructive" onClick={() => removeDetail(index)}><Trash className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendDetail({ label: '', value: '' })}>Thêm chi tiết</Button>
                  
                  <FormField control={form.control} name="productDetails.conclusion" render={({ field }) => (<FormItem><FormLabel>Kết luận</FormLabel><FormControl><Textarea placeholder="Nội dung kết luận..." {...field} rows={4} /></FormControl></FormItem>)} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle>Hình ảnh</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <Image src={imagePreview} alt="Xem trước ảnh" width={200} height={200} className="w-full rounded-md object-contain" />
                      <Button variant="destructive" size="icon" className="absolute right-2 top-2 h-6 w-6" onClick={() => { setImagePreview(null); form.setValue('image', null); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <FormField control={form.control} name="image" render={() => (
                      <FormItem>
                        <FormLabel htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex items-center justify-center border-2 border-dashed p-4 text-center text-muted-foreground hover:bg-accent">
                            <Upload className="mr-2 h-4 w-4" />
                            <span>{isUploading ? 'Đang tải lên...' : 'Tải ảnh lên'}</span>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                        </FormControl>
                        {isUploading && <Progress value={progress} />}
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
                
                <FormField control={form.control} name="categoryIds" render={() => (
                    <FormItem>
                      <FormLabel>Danh mục chính</FormLabel>
                      {isLoadingCategories ? <p>Đang tải...</p> : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {(categories || []).map((category: Category) => (
                            <FormField key={category.id} control={form.control} name="categoryIds" render={({ field }) => (
                                <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox checked={field.value?.includes(category.id)} onCheckedChange={(checked) => {
                                      return checked ? field.onChange([...field.value || [], category.id]) : field.onChange(field.value?.filter((value) => value !== category.id))
                                    }} />
                                  </FormControl>
                                  <FormLabel className="font-normal">{category.name}</FormLabel>
                                </FormItem>
                            )} />
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                )} />
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormDescription>Phân cách các tag bằng dấu phẩy (,)</FormDescription>
                  <FormControl><Input placeholder="Vd: scotch, old-rare, islay" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} /></FormControl>
                  <FormMessage />
                </FormItem>
              </CardContent>
            </Card>
          </div>
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
          {isUploading ? 'Đang tải ảnh...' : form.formState.isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
        </Button>
      </form>
    </Form>
  );
}
