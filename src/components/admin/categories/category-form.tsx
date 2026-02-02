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
import { wineMegaMenuData, spiritsMegaMenuData, glasswareMegaMenuData, giftSetMegaMenuData } from '@/lib/mega-menu-data';
import { useMemo } from 'react';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  slug: z.string().min(2, { message: 'Đường dẫn phải có ít nhất 2 ký tự.' }),
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

const renderGlasswareMegaMenuSelectors = (control: Control<CategoryFormValues>) => {
    return (
        <>
            {renderCheckboxGroup(control, "Ly Pha Lê Riedel", glasswareMegaMenuData.lyPhaLeRiedel)}
            {renderCheckboxGroup(control, "Ly Whisky", glasswareMegaMenuData.lyWhisky)}
            {renderCheckboxGroup(control, "Loại khác", glasswareMegaMenuData.khac)}
        </>
    );
};

const renderGiftSetMegaMenuSelectors = (control: Control<CategoryFormValues>) => {
    return (
        <>
            {renderCheckboxGroup(control, "Loại quà tặng", giftSetMegaMenuData.quaTang)}
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
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    form.setValue('slug', slugify(name, { lower: true, strict: true, locale: 'vi' }));
  };

  const categoryOptions = useMemo(() => {
    if (!categories) return [];

    const parentToChildren: Map<string | null, Category[]> = new Map();

    categories.forEach(cat => {
      const parentId = cat.parentId || null;
      if (!parentToChildren.has(parentId)) {
        parentToChildren.set(parentId, []);
      }
      parentToChildren.get(parentId)!.push(cat);
    });

    const buildOptions = (parentId: string | null, level: number): JSX.Element[] => {
      const children = parentToChildren.get(parentId) || [];
      let options: JSX.Element[] = [];

      children.sort((a, b) => a.name.localeCompare(b.name));

      for (const category of children) {
        if (category.id === initialData?.id) continue;

        options.push(
          <SelectItem key={category.id} value={category.id}>
            <span style={{ paddingLeft: `${level * 1.5}rem` }}>
              {level > 0 ? '— ' : ''}{category.name}
            </span>
          </SelectItem>
        );
        options.push(...buildOptions(category.id, level + 1));
      }
      return options;
    }

    return buildOptions(null, 0);

  }, [categories, initialData?.id]);

  const getRedirectUrl = () => {
    const page = searchParams.get('page');
    return page ? `/admin/categories?page=${page}` : '/admin/categories';
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
        const finalData = {
          ...data,
          slug: data.slug || slugify(data.name, { lower: true, strict: true, locale: 'vi' }),
          parentId: data.parentId || null,
          description: data.description || '',
          tags: data.tags || [],
        };
      
      if (initialData && initialData.id) {
        const docRef = doc(firestore, 'categories', initialData.id);
        await updateDoc(docRef, {
            // On edit, name and slug are not editable from the form.
            // We only update parentId, description, and tags.
            parentId: finalData.parentId,
            description: finalData.description,
            tags: finalData.tags
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
                    { !initialData ? (
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên danh mục</FormLabel>
                                    <FormControl>
                                    <Input
                                        placeholder="Vd: Rượu Vang Đỏ"
                                        {...field}
                                        onChange={handleNameChange}
                                    />
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
                                    <FormLabel>Đường dẫn (slug)</FormLabel>
                                    <FormControl>
                                    <Input placeholder="ruou-vang-do" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    ) : (
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
                              {categoryOptions}
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
                 <Card>
                    <CardHeader>
                        <CardTitle>Phân loại Ly & Cốc</CardTitle>
                        <CardDescription>Chọn các thẻ phân loại chi tiết cho danh mục này.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-72">
                            <div className="pr-4">
                                {renderGlasswareMegaMenuSelectors(form.control)}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Phân loại Bộ Quà Tặng</CardTitle>
                        <CardDescription>Chọn các thẻ phân loại chi tiết cho danh mục này.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-72">
                            <div className="pr-4">
                                {renderGiftSetMegaMenuSelectors(form.control)}
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
