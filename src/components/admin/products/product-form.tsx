

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
import type { FullProduct } from '@/lib/types';
import { Trash, X } from 'lucide-react';
import Image from 'next/image';
import {
  doc,
  collection,
  serverTimestamp,
  addDoc,
  setDoc,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import {
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import slugify from 'slugify';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { allTags } from '@/lib/tags-data';
import { ScrollArea } from '@/components/ui/scroll-area';

const productAttributeSchema = z.object({
  label: z.string().min(1, 'Nhãn không được để trống'),
  value: z.string().min(1, 'Giá trị không được để trống'),
});

const formSchema = z.object({
  nameVN: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  slug: z.string().min(2, { message: 'Slug phải có ít nhất 2 ký tự.' }),
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive('Giá phải là số dương.')),
  description: z.string().optional(),
  image: z
    .object({
      url: z.string().url({ message: "Vui lòng nhập một URL hợp lệ." }).or(z.literal('')),
      path: z.string().optional(),
    })
    .nullable(),
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
  const firestore = useFirestore();
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image?.url || null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          description: initialData.description || '',
          attributes: initialData.attributes || [],
          tags: initialData.tags || [],
          image: initialData.image ? { url: initialData.image.url, path: initialData.image.path || '' } : { url: '', path: '' },
        }
      : {
          nameVN: '',
          slug: '',
          price: 0,
          description: '',
          image: { url: '', path: '' },
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('nameVN', name);
    form.setValue('slug', slugify(name, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }));
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url) {
        form.setValue('image.url', url);
        form.setValue('image.path', url); // Use URL as path
        setImagePreview(url);
    } else {
        form.setValue('image', null);
        setImagePreview(null);
    }
  };


  const onSubmit = async (data: ProductFormValues) => {
    try {
      const productData = {
        nameVN: data.nameVN,
        slug: data.slug,
        price: Number(data.price),
        description: data.description || '',
        image: data.image && data.image.url ? { url: data.image.url, path: data.image.path || '' } : null,
        status: data.status,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        attributes: data.attributes || [],
        tags: data.tags || [],
        updatedAt: serverTimestamp(),
      };

      if (initialData) {
        const productRef = doc(firestore, 'products', initialData.id);
        const finalData = { ...productData, createdAt: initialData.createdAt };
        await setDoc(productRef, finalData);
        toast({ title: 'Thành công', description: 'Sản phẩm đã được cập nhật.' });

      } else {
        const collectionRef = collection(firestore, 'products');
        const finalData = { ...productData, createdAt: serverTimestamp() };
        await addDoc(collectionRef, finalData);
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
                <FormField control={form.control} name="nameVN" render={({ field }) => (<FormItem><FormLabel>Tên sản phẩm</FormLabel><FormControl><Input placeholder="Vd: The Macallan 18" {...field} onChange={handleNameChange} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Đường dẫn (Slug)</FormLabel><FormControl><Input placeholder="the-macallan-18" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Giá</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
              <CardHeader><CardTitle>Hình ảnh</CardTitle></CardHeader>
              <CardContent>
                 <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <Image src={imagePreview} alt="Xem trước ảnh" width={200} height={200} className="w-full rounded-md object-contain" />
                       <Button variant="destructive" size="icon" className="absolute right-2 top-2 h-6 w-6" onClick={() => { handleImageUrlChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>) }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="image.url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL hình ảnh</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.png"
                            {...field}
                            value={field.value || ''}
                            onChange={handleImageUrlChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Dán URL hình ảnh sản phẩm vào đây.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                      <div className="mb-4">
                        <FormLabel>Tags (Loại sản phẩm)</FormLabel>
                        <FormDescription>
                          Chọn các tags phù hợp. Dùng để lọc sản phẩm theo loại.
                        </FormDescription>
                      </div>
                       <ScrollArea className="h-48 rounded-md border">
                          <div className="p-4 grid grid-cols-2 gap-2">
                          {allTags.map((tag) => (
                            <FormField
                              key={tag.id}
                              control={form.control}
                              name="tags"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={tag.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(tag.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), tag.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== tag.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {tag.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
                Hủy
            </Button>
        </div>
      </form>
    </Form>
  );
}
