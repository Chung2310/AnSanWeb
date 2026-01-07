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
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import FileUploader from '@/components/admin/products/file-uploader';
import type { ImageInfo, FullProduct } from '@/lib/types';
import { Loader2 } from 'lucide-react';


const formSchema = z.object({
  // From Product
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
  
  // From ProductDetail
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  detailImage: z.object({
      url: z.string().min(1, "URL ảnh chi tiết là bắt buộc"),
      path: z.string().min(1, "Đường dẫn ảnh chi tiết là bắt buộc")
  }).nullable(),
});

function generateSlug(name: string) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD') // Decompose combined graphemes into base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/đ/g, 'd') // Replace đ with d
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Collapse whitespace and replace by -
    .replace(/-+/g, '-'); // Collapse dashes
}


export function ProductForm() {
  const { isOpen, onClose, defaultValues, id } = useProductDialog();
  const firestore = useFirestore();
  const [uploadingStatus, setUploadingStatus] = useState({ image: false, detailImage: false });

  const isAnyFileUploading = uploadingStatus.image || uploadingStatus.detailImage;
  const isEditMode = !!id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const nameVNValue = form.watch('nameVN');
  const { isSubmitting } = form.formState;

  const handleUploadStateChange = useCallback((isUploading: boolean, fieldName: 'image' | 'detailImage') => {
    setUploadingStatus(prev => ({ ...prev, [fieldName]: isUploading }));
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
                description: '',
                image: undefined,
                detailImage: null,
                attributes: [],
                tags: '',
            });
        }
    }
}, [defaultValues, form, isOpen]);


  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;

    const productsCollectionRef = collection(firestore, 'products');
    const detailsCollectionRef = collection(firestore, 'product_details');
    
    const productData = {
        nameVN: values.nameVN,
        nameEN: values.nameEN,
        slug: values.slug,
        price: values.price,
        image: values.image,
        attributes: values.attributes || [], 
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };

    const detailData = {
        description: values.description,
        detailImage: values.detailImage,
        // TODO: Add forms for these fields later
        tastingNotes: defaultValues?.tastingNotes || null,
        productDetails: defaultValues?.productDetails || null,
    };

    if (isEditMode && id) {
        const productDocRef = doc(productsCollectionRef, id);
        const detailDocRef = doc(detailsCollectionRef, id);
        
        await updateDocumentNonBlocking(productDocRef, productData);
        await setDocumentNonBlocking(detailDocRef, detailData, { merge: true });

    } else {
        const newProductRef = await addDocumentNonBlocking(productsCollectionRef, {
            ...productData,
            createdAt: new Date().toISOString(),
            isFeatured: false,
            isNew: true,
        });

        if (newProductRef) {
            const detailDocRef = doc(detailsCollectionRef, newProductRef.id);
            await setDocumentNonBlocking(detailDocRef, detailData, { merge: false });
        }
    }
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Chỉnh sửa' : 'Thêm'} Sản phẩm</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Chỉnh sửa thông tin cho sản phẩm ${defaultValues?.nameVN}.`
              : 'Thêm một sản phẩm mới vào danh mục của bạn.'}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4"
            >
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

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploader
                      fieldName="image"
                      label="Ảnh bìa (listing)"
                      defaultUrl={form.getValues('image.url')}
                      onUploadStateChange={handleUploadStateChange}
                  />
                  <FileUploader
                      fieldName="detailImage"
                      label="Ảnh trang chi tiết"
                      defaultUrl={form.getValues('detailImage.url')}
                      onUploadStateChange={handleUploadStateChange}
                  />
              </div>
              
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Mô tả chi tiết về sản phẩm..."
                          className='min-h-[100px]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="md:col-span-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting || isAnyFileUploading}>
                  {(isSubmitting || isAnyFileUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
