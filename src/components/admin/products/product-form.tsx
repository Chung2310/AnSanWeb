'use client';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useProductDialog } from '@/stores/use-product-dialog';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import FileUploader from './file-uploader';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  nameVN: z.string().min(2, "Tên tiếng Việt phải có ít nhất 2 ký tự."),
  nameEN: z.string().min(2, "Tên tiếng Anh phải có ít nhất 2 ký tự."),
  slug: z.string().min(2, "Slug phải có ít nhất 2 ký tự."),
  price: z.coerce.number().min(0, "Giá phải là số dương."),
  image: z.object({
    url: z.string().url("URL ảnh không hợp lệ."),
    path: z.string(),
  }),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  tags: z.string().optional(),
  attributes: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function ProductForm() {
  const { isOpen, onClose, defaultValues } = useProductDialog();
  const { toast } = useToast();
  const firestore = useFirestore();

  const isEditMode = !!defaultValues?.id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameVN: '',
      nameEN: '',
      slug: '',
      price: 0,
      isFeatured: false,
      isNew: true,
      tags: '',
      attributes: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      const valuesToSet = defaultValues 
        ? {
            ...defaultValues,
            tags: defaultValues.tags?.join(', '), // Convert array to comma-separated string
            price: defaultValues.price || 0,
          }
        : {
            nameVN: '',
            nameEN: '',
            slug: '',
            price: 0,
            image: undefined,
            isFeatured: false,
            isNew: true,
            tags: '',
            attributes: [],
          };
      form.reset(valuesToSet);
    }
  }, [isOpen, defaultValues, form]);


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
        if (!defaultValues.id) throw new Error('Product ID is missing for update.');
        const productRef = doc(firestore, 'products', defaultValues.id);
        await updateDoc(productRef, {
            ...dataToSave,
            updatedAt: serverTimestamp(),
        });
        toast({ title: 'Thành công', description: 'Đã cập nhật sản phẩm.' });
      } else {
        await addDoc(collection(firestore, 'products'), {
            ...dataToSave,
            createdAt: serverTimestamp(),
        });
        toast({ title: 'Thành công', description: 'Đã tạo sản phẩm mới.' });
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: 'destructive',
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu sản phẩm. Vui lòng thử lại.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Cập nhật thông tin chi tiết cho sản phẩm này.' : 'Điền thông tin để tạo một sản phẩm mới.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ảnh đại diện</FormLabel>
                        <FormControl>
                             <Input
                                type="text"
                                placeholder="Dán URL ảnh vào đây"
                                onChange={(e) => field.onChange({ url: e.target.value, path: e.target.value })}
                                value={field.value?.url || ''}
                            />
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
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}