
'use client';
import { Button } from '@/components/ui/button';
import { Filter, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/admin/categories/data-table';
import { columns } from '@/components/admin/categories/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useState, useMemo } from 'react';
import type { Category } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useFirestore } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { wineMegaMenuData, spiritsMegaMenuData, glasswareMegaMenuData, giftSetMegaMenuData } from '@/lib/mega-menu-data';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function CategoriesAdminPage() {
    const { categories, isLoading } = useCategories();
    const [filter, setFilter] = useState('all'); // 'all' or 'parents'
    const [nameFilter, setNameFilter] = useState('');
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isRestoring, setIsRestoring] = useState(false);
    
    const categoryMap = useMemo(() => {
      if (!categories) return new Map<string, string>();
      return new Map(categories.map(c => [c.id, c.name]));
    }, [categories]);
    
    const filteredCategories = useMemo(() => {
        if (!categories) return [];
        if (filter === 'parents') {
          return categories.filter(c => !c.parentId);
        }
        return categories;
    }, [categories, filter]);

    const handleRestore = async () => {
        setIsRestoring(true);
        toast({ title: 'Đang khôi phục danh mục...' });

        try {
            const batch = writeBatch(firestore);
            const categoriesCol = collection(firestore, 'categories');

            const allCategoriesToCreate: Omit<Category, 'createdAt' | 'updatedAt' | 'status' | 'image'>[] = [];

            const mainCats = [
                { id: 'ruou-vang', name: 'Rượu Vang', slug: 'ruou-vang' },
                { id: 'ruou-manh', name: 'Rượu Mạnh', slug: 'ruou-manh' },
                { id: 'ly-coc-pha-le', name: 'Ly - Cốc Pha Lê', slug: 'ly-coc-pha-le' },
                { id: 'bo-qua-tang', name: 'Bộ Quà Tặng', slug: 'bo-qua-tang' },
                { id: 'cigar', name: 'Cigar', slug: 'cigar' },
            ];
            mainCats.forEach(cat => {
                allCategoriesToCreate.push({ ...cat, description: '', tags: [], parentId: null });
            });

            const addItemsWithParent = (items: { label: string; slug: string; category_id: string }[], parentId: string) => {
              items.forEach(item => {
                allCategoriesToCreate.push({
                  id: item.category_id,
                  name: item.label,
                  slug: item.slug,
                  description: '',
                  tags: [],
                  parentId: parentId,
                });
              });
            };

            addItemsWithParent(wineMegaMenuData.theoLoai, 'ruou-vang');
            addItemsWithParent(wineMegaMenuData.theoQuocGia, 'ruou-vang');
            addItemsWithParent(wineMegaMenuData.theoVung, 'ruou-vang');
            addItemsWithParent(wineMegaMenuData.theoGiongNho, 'ruou-vang');

            addItemsWithParent(spiritsMegaMenuData.theoLoai, 'ruou-manh');
            addItemsWithParent(spiritsMegaMenuData.thuongHieu, 'ruou-manh');
            
            // Fix: quà tặng của rượu mạnh thuộc danh mục bộ quà tặng
            addItemsWithParent(spiritsMegaMenuData.quaTang, 'bo-qua-tang');

            addItemsWithParent(glasswareMegaMenuData.lyPhaLeRiedel, 'ly-coc-pha-le');
            addItemsWithParent(glasswareMegaMenuData.lyWhisky, 'ly-coc-pha-le');
            addItemsWithParent(glasswareMegaMenuData.khac, 'ly-coc-pha-le');
            
            addItemsWithParent(giftSetMegaMenuData.quaTang, 'bo-qua-tang');
            
            const uniqueCategories = Array.from(new Map(allCategoriesToCreate.map(item => [item.id, item])).values());

            uniqueCategories.forEach(category => {
                const docRef = doc(categoriesCol, category.id);
                batch.set(docRef, { ...category, description: category.description || '' }, { merge: true });
            });

            await batch.commit();

            toast({ title: 'Thành công!', description: `${uniqueCategories.length} danh mục mặc định đã được khôi phục/cập nhật.` });

        } catch (error) {
            console.error("Error restoring categories:", error);
            toast({
                variant: 'destructive',
                title: 'Lỗi',
                description: 'Không thể khôi phục danh mục.',
            });
        } finally {
            setIsRestoring(false);
        }
    };
  
    const memoizedColumns = useMemo(() => columns(categoryMap), [categoryMap]);


  if (isLoading && !categories) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>
        <div className="my-4">
             <Skeleton className="h-14 w-full" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Danh mục sản phẩm</h1>
         <div className="flex items-center gap-4">
            <Button onClick={handleRestore} disabled={isRestoring} variant="outline">
                {isRestoring ? 'Đang khôi phục...' : 'Khôi phục mặc định'}
            </Button>
            <Button asChild>
            <Link href="/admin/categories/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm danh mục mới
            </Link>
            </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="my-4 bg-card p-4 rounded-md border">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger>
            <div className='flex items-center gap-2 text-base font-semibold'>
              <Filter className="h-4 w-4" />
              <span>Lọc danh mục ({filteredCategories.length} / {categories?.length || 0} kết quả)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-4">
                    <h4 className='font-semibold text-base border-b pb-2'>Tìm theo tên</h4>
                     <Input 
                        placeholder="Tên danh mục..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </div>
                <div className="space-y-4">
                    <h4 className='font-semibold text-base border-b pb-2'>Hiển thị</h4>
                    <RadioGroup value={filter} onValueChange={setFilter} className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="cat-all" />
                            <Label htmlFor="cat-all" className="font-normal cursor-pointer">Tất cả danh mục</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="parents" id="cat-parents" />
                            <Label htmlFor="cat-parents" className="font-normal cursor-pointer">Chỉ danh mục cha</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="button" variant="secondary" onClick={() => {
                  setFilter('all');
                  setNameFilter('');
              }}>Xóa bộ lọc</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6">
        <DataTable columns={memoizedColumns} data={filteredCategories || []} nameFilter={nameFilter} />
      </div>
    </div>
  );
}
