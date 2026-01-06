'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { sampleWines } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  nameVN: z.string().min(1, 'Tên tiếng Việt là bắt buộc'),
  nameEN: z.string().min(1, 'Tên tiếng Anh là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  price: z.coerce.number().min(0, 'Giá phải là số dương'),
  origin: z.string().min(1, 'Xuất xứ là bắt buộc'),
  type: z.enum([
    'Vang Đỏ',
    'Vang Trắng',
    'Vang Hồng',
    'Vang Sủi',
    'Vang Tráng Miệng',
    'Whisky',
    'Gift Set',
    'Tasting Set',
    'Armagnac',
  ]),
  alcohol: z.coerce.number().min(0).max(100),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  imageId: z.string().min(1, 'Ảnh là bắt buộc'),
});

export function ProductForm() {
  const { isOpen, onClose, defaultValues, id } = useProductDialog();
  const firestore = useFirestore();

  const isEditMode = !!id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        form.reset({
          ...defaultValues,
          imageId: defaultValues.image?.id || '',
        });
      } else {
        form.reset({
          nameVN: '',
          nameEN: '',
          slug: '',
          price: 0,
          origin: '',
          type: 'Whisky',
          alcohol: 40,
          description: '',
          imageId: '',
        });
      }
    }
  }, [defaultValues, form, isOpen]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!firestore) return;

    const winesCollectionRef = collection(firestore, 'wines');
    
    const image = PlaceHolderImages.find(p => p.id === values.imageId);
    if (!image) {
      console.error("Selected image not found");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageId, ...restOfValues } = values;

    const dataToSave = {
        ...restOfValues,
        image,
    };

    if (isEditMode && id) {
      const docRef = doc(winesCollectionRef, id);
      updateDocumentNonBlocking(docRef, dataToSave);
    } else {
      addDocumentNonBlocking(winesCollectionRef, {
          ...dataToSave,
          createdAt: new Date().toISOString(),
          isFeatured: false,
          isNew: true,
      });
    }
    onClose();
  };

  const wineTypes = Array.from(new Set(sampleWines.map(w => w.type)));


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
              name="imageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh sản phẩm</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn một ảnh" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PlaceHolderImages.map(img => (
                        <SelectItem key={img.id} value={img.id}>{img.id} ({img.description})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xuất xứ</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Scotland" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại sản phẩm</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn một loại" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wineTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alcohol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nồng độ cồn (%)</FormLabel>
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
              <Button type="submit">Lưu Thay Đổi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
