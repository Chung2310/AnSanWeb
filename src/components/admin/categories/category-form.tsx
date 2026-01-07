'use client';
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
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
import { useCategoryDialog } from '@/stores/use-category-dialog';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import FileUploader from '../products/file-uploader';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  slug: z.string().min(2, { message: 'Slug phải có ít nhất 2 ký tự.' }),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  image: z
    .object({
      url: z.string(),
      path: z.string(),
    })
    .nullable(),
}).refine(data => data.image, {
    message: "Vui lòng tải lên một ảnh đại diện.",
    path: ["image"],
});

type CategoryFormValues = z.infer<typeof formSchema>;

export default function CategoryForm() {
  const { isOpen, onClose, defaultValues } = useCategoryDialog();
  const { toast } = useToast();
  const firestore = useFirestore();

  const isEditMode = !!defaultValues?.id;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      status: 'active',
      image: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(
        defaultValues
          ? {
              name: defaultValues.name || '',
              slug: defaultValues.slug || '',
              description: defaultValues.description || '',
              // @ts-ignore
              status: defaultValues.status || 'active',
              image: defaultValues.image || null,
            }
          : {
              name: '',
              slug: '',
              description: '',
              status: 'active',
              image: null,
            }
      );
    }
  }, [isOpen, defaultValues, form]);


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!form.formState.dirtyFields.slug) {
        const slug = name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        form.setValue('slug', slug);
    }
  };


  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (isEditMode) {
        if (!defaultValues.id) throw new Error('Category ID is missing for update.');
        const categoryRef = doc(firestore, 'categories', defaultValues.id);
        await updateDoc(categoryRef, {
            ...values,
            updatedAt: serverTimestamp(),
        });
        toast({ title: 'Thành công', description: 'Đã cập nhật danh mục.' });
      } else {
        await addDoc(collection(firestore, 'categories'), {
            ...values,
            createdAt: serverTimestamp(),
        });
        toast({ title: 'Thành công', description: 'Đã tạo danh mục mới.' });
      }
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        variant: 'destructive',
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu danh mục. Vui lòng thử lại.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Cập nhật thông tin chi tiết cho danh mục này.' : 'Điền thông tin để tạo một danh mục mới.'}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ảnh đại diện</FormLabel>
                                    <FormControl>
                                        <FileUploader 
                                            fieldName="image"
                                            onFieldChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tên danh mục</FormLabel>
                            <FormControl>
                                <Input placeholder="Vd: Scotch Whisky" {...field} onChange={handleNameChange} />
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
                                <Input placeholder="Vd: scotch-whisky" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="col-span-2">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Mô tả ngắn về danh mục..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-2">
                                <div className="space-y-0.5">
                                    <FormLabel>Trạng thái</FormLabel>
                                    <FormMessage />
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value === 'active'}
                                        onCheckedChange={(checked) => field.onChange(checked ? 'active' : 'inactive')}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
                </div>
            </form>
            </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}