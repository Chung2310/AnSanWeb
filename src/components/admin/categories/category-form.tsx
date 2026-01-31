'use client';

import { useForm, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/types';
import slugify from 'slugify';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCategories } from '@/hooks/use-categories';
import RichTextEditor from '@/components/admin/blog/rich-text-editor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { wineMegaMenuData, spiritsMegaMenuData } from '@/lib/mega-menu-data';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  parentId: z.string().nullable().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const renderCheckboxGroup = (control: Control<CategoryFormValues>, title: string, items: { label: string; category_id: string }[]) => {
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

const renderWineMegaMenuSelectors = (control: Control<CategoryFormValues>) => {
    return (
        <>
            {renderCheckboxGroup(control, "Theo loại", wineMegaMenuData.theoLoai)}
            {renderCheckboxGroup(control, "Theo quốc gia", wineMegaMenuData.theoQuocGia)}
            {renderCheckboxGroup(control, "Theo vùng", wineMegaMenuData.theoVung)}
            {renderCheckboxGroup(control, "Theo giống nho", wineMegaMenuData.theoGiongNho)}
        </>
    );
};

const renderSpiritsMegaMenuSelectors = (control: Control<CategoryFormValues>) => {
    return (
        <>
            {renderCheckboxGroup(control, "Theo loại rượu", spiritsMegaMenuData.theoLoai)}
            {renderCheckboxGroup(control, "Thương hiệu", spiritsMegaMenuData.thuongHieu)}
        </>
    );
};

interface CategoryFormProps {
  initialData?: Category;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const firestore = useFirestore();
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          description: initialData.description || '',
          tags: initialData.tags || [],
        }
      : {
          name: '',
          slug: '',
          parentId: null,
          description: '',
          tags: [],
        },
  });

  const getRedirectUrl = () => {
    const page = searchParams.get('page');
    return page ? `/admin/categories?page=${page}` : '/admin/categories';
  };


  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const processedData: any = { ...data };

      // Logic for creation: auto-generate name and slug from description
      if (!initialData) {
        const description = processedData.description || '';
        let newName = '';
        
        // Attempt to extract name from H1, H2, or H3 in description
        const headingMatch = description.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/);
        if (headingMatch && headingMatch[1]) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = headingMatch[1];
          newName = (tempDiv.textContent || tempDiv.innerText || '').trim();
        }

        if (newName) {
          processedData.name = newName;
          processedData.slug = slugify(newName, { lower: true, strict: true, locale: 'vi' });
        } else {
            toast({
                variant: 'destructive',
                title: 'Không thể tạo danh mục',
                description: 'Vui lòng thêm một tiêu đề (H1, H2, hoặc H3) vào phần mô tả để tự động tạo tên danh mục.',
            });
            return;
        }
      }
      
      const finalData = {
          name: processedData.name,
          slug: processedData.slug,
          parentId: processedData.parentId || null,
          description: processedData.description || '',
          tags: processedData.tags || [],
      };


      if (initialData && initialData.id) {
        const docRef = doc(firestore, 'categories', initialData.id);
        await updateDoc(docRef, {
            ...finalData,
            name: initialData.name, // Preserve original name and slug on edit
            slug: initialData.slug,
            description: processedData.description,
            parentId: processedData.parentId,
            tags: processedData.tags
        });
        toast({ title: 'Thành công', description: 'Danh mục đã được cập nhật.' });
      } else {
        const collectionRef = collection(firestore, 'categories');
        const newDocRef = doc(collectionRef);
        
        await setDoc(newDocRef, {
            ...finalData,
            id: newDocRef.id,
        });
        toast({ title: 'Thành công', description: `Danh mục "${finalData.name}" đã được tạo.` });
      }
      router.push(getRedirectUrl());
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        variant: 'destructive',
        title: 'Đã có lỗi xảy ra',
        description: 'Không thể lưu danh mục. Vui lòng thử lại.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                <CardHeader>
                    <CardTitle>Thông tin danh mục</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    { initialData && (
                        <div className="space-y-4">
                            <FormItem>
                                <FormLabel>Tên danh mục (Không thể chỉnh sửa)</FormLabel>
                                <Input value={initialData.name} readOnly disabled />
                            </FormItem>
                             <FormItem>
                                <FormLabel>Đường dẫn (slug) (Không thể chỉnh sửa)</FormLabel>
                                <Input value={initialData.slug} readOnly disabled />
                            </FormItem>
                        </div>
                    )}
                    <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Danh mục cha</FormLabel>
                        <Select
                            onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                            value={field.value || 'none'}
                            disabled={isLoadingCategories}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục cha (nếu có)" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="none">Không có</SelectItem>
                            {categories?.filter(c => c.id !== initialData?.id).map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                {category.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mô tả danh mục (Nội dung SEO)</FormLabel>
                        <FormDescription>
                           { !initialData && "Để tạo danh mục, hãy thêm một tiêu đề (H1/H2/H3) trong phần mô tả này. Tiêu đề sẽ được dùng làm tên danh mục."}
                        </FormDescription>
                        <FormControl>
                            <RichTextEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            folder="category-content"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân loại Rượu Vang</CardTitle>
                        <CardDescription>Chọn các thẻ phân loại chi tiết cho danh mục này.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-72">
                            <div className="pr-4">
                                {renderWineMegaMenuSelectors(form.control)}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Phân loại Rượu Mạnh</CardTitle>
                        <CardDescription>Chọn các thẻ phân loại chi tiết cho danh mục này.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-72">
                            <div className="pr-4">
                                {renderSpiritsMegaMenuSelectors(form.control)}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? 'Đang lưu...'
                : initialData
                ? 'Cập nhật'
                : 'Tạo danh mục'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(getRedirectUrl())}>
                Hủy
            </Button>
        </div>
      </form>
    </Form>
  );
}
