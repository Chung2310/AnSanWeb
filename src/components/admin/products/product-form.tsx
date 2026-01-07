'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
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
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

const formSchema = z.object({
  nameVN: z.string().min(1, 'Tên tiếng Việt là bắt buộc'),
  nameEN: z.string().min(1, 'Tên tiếng Anh là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  price: z.coerce.number().min(0, 'Giá phải là số dương'),
  image: z.object({
    url: z.string().min(1, "URL ảnh bìa là bắt buộc"),
    path: z.string().optional(),
    imageHint: z.string().optional(),
  }).nullable(),
  tags: z.string().optional(),
  attributes: z.array(z.object({
    label: z.string().min(1, "Nhãn không được để trống"),
    value: z.string().min(1, "Giá trị không được để trống")
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
  const { isOpen, onClose, id } = useProductDialog();
  const firestore = useFirestore();
  
  const isEditMode = !!id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attributes: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes"
  });
  
  const nameVNValue = form.watch('nameVN');
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (nameVNValue && !isEditMode) {
      const slug = generateSlug(nameVNValue);
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [nameVNValue, form, isEditMode]);


  useEffect(() => {
    if (isOpen) {
      const { defaultValues } = useProductDialog.getState();
      if (defaultValues) {
          form.reset({
              ...defaultValues,
              tags: defaultValues.tags?.join(', ') || '',
              attributes: defaultValues.attributes || [],
          });
      } else {
          form.reset({
              nameVN: '',
              nameEN: '',
              slug: '',
              price: 0,
              image: null,
              attributes: [],
              tags: '',
          });
      }
    }
  }, [isOpen, form.reset]);


  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore || !values.image) return;
    
    const productData = {
        nameVN: values.nameVN,
        nameEN: values.nameEN,
        slug: values.slug,
        price: values.price,
        image: {
            ...values.image,
            path: values.image.path || '',
            imageHint: values.image.imageHint || '',
        },
        attributes: values.attributes || [], 
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };


    if (isEditMode && id) {
        const productDocRef = doc(firestore, 'products', id);
        await updateDocumentNonBlocking(productDocRef, productData);
    } else {
        await addDocumentNonBlocking(collection(firestore, 'products'), {
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
              ? `Chỉnh sửa thông tin cơ bản cho sản phẩm.`
              : 'Điền thông tin cơ bản để tạo sản phẩm.'}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-4">
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
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
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

                        {/* Attributes Section */}
                        <div className="space-y-4 rounded-md border p-4">
                            <div className="flex justify-between items-center">
                               <h3 className="text-sm font-medium">Thuộc tính</h3>
                               <Button type="button" size="sm" variant="ghost" onClick={() => append({ label: '', value: '' })}>
                                   <PlusCircle className="mr-2 h-4 w-4" /> Thêm
                               </Button>
                            </div>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-end">
                                    <FormField
                                        control={form.control}
                                        name={`attributes.${index}.label`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="text-xs">Nhãn</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="VD: Xuất xứ" />
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
                                                <FormLabel className="text-xs">Giá trị</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="VD: Scotland" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="md:col-span-1 space-y-4">
                       <FormField
                          control={form.control}
                          name="image.url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL Ảnh bìa</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://example.com/image.jpg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                </div>
                <DialogFooter className="pt-6">
                    <Button type="button" variant="outline" onClick={onClose}>
                    Hủy
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
