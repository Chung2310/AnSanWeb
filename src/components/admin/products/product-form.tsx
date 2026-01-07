'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProductDialog } from '@/components/admin/products/use-product-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { useFirestore } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import FileUploader from '@/components/admin/products/file-uploader';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  nameVN: z.string().min(1, 'Tên tiếng Việt là bắt buộc'),
  nameEN: z.string().min(1, 'Tên tiếng Anh là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  price: z.coerce.number().min(0, 'Giá phải là số dương'),
  image: z.object({
    url: z.string().min(1, "URL ảnh bìa là bắt buộc"),
    path: z.string().min(1, "Đường dẫn ảnh bìa là bắt buộc")
  }),
  tags: z.string().optional(),
  attributes: z.array(z.object({
    label: z.string(),
    value: z.string()
  })).optional(),
});

function generateSlug(name: string) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}


export function ProductForm() {
  const { isOpen, onClose, defaultValues, id } = useProductDialog();
  const firestore = useFirestore();
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const nameVNValue = form.watch('nameVN');
  const { isSubmitting } = form.formState;

  const handleUploadStateChange = useCallback((uploading: boolean) => {
    setIsUploading(uploading);
  }, []);

  useEffect(() => {
    if (nameVNValue && !isEditMode) {
      const slug = generateSlug(nameVNValue);
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [nameVNValue, form, isEditMode]);


  useEffect(() => {
    if (isOpen) {
        if (defaultValues) {
            form.reset({
                ...defaultValues,
                tags: defaultValues.tags?.join(', ') || '',
            });
        } else {
            form.reset({
                nameVN: '',
                nameEN: '',
                slug: '',
                price: 0,
                image: undefined,
                attributes: [],
                tags: '',
            });
        }
    }
}, [defaultValues, form, isOpen]);


  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;

    const productsCollectionRef = collection(firestore, 'products');
    
    const productData = {
        nameVN: values.nameVN,
        nameEN: values.nameEN,
        slug: values.slug,
        price: values.price,
        image: values.image,
        attributes: values.attributes || [], 
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };


    if (isEditMode && id) {
        const productDocRef = doc(productsCollectionRef, id);
        await updateDocumentNonBlocking(productDocRef, productData);
    } else {
        await addDocumentNonBlocking(productsCollectionRef, {
            ...productData,
            createdAt: new Date().toISOString(),
            isFeatured: false,
            isNew: true,
        });
    }
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Chỉnh sửa' : 'Thêm'} Sản phẩm (Cơ bản)</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Chỉnh sửa thông tin cơ bản cho sản phẩm ${defaultValues?.nameVN}.`
              : 'Điền thông tin cơ bản để tạo sản phẩm.'}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="nameVN"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên tiếng Việt</FormLabel>
                                <FormControl>
                                <Input {...field} placeholder="The Macallan 18..." />
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
                                <FormLabel>Tên tiếng Anh</FormLabel>
                                <FormControl>
                                <Input {...field} placeholder="The Macallan 18..." />
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
                                <FormLabel>Slug (URL)</FormLabel>
                                <FormControl>
                                <Input {...field} placeholder="the-macallan-18" />
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
                                <FormLabel>Giá (VNĐ)</FormLabel>
                                <FormControl>
                                <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="md:col-span-2">
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags (phân cách bằng dấu phẩy)</FormLabel>
                                    <FormControl>
                                    <Input {...field} placeholder="scotch, speyside, old-rare" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <FileUploader
                                fieldName="image"
                                label="Ảnh bìa (listing)"
                                defaultUrl={form.getValues('image.url')}
                                onUploadStateChange={(isUploading) => handleUploadStateChange(isUploading)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="pt-6">
                    <Button type="button" variant="outline" onClick={onClose}>
                    Hủy
                    </Button>
                    <Button type="submit" disabled={isSubmitting || isUploading}>
                    {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Lưu Thay Đổi
                    </Button>
                </DialogFooter>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
