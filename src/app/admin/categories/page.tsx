'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/admin/categories/data-table';
import { columns } from '@/components/admin/categories/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useState, useMemo } from 'react';
import type { Category } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { wineMegaMenuData, spiritsMegaMenuData, glasswareMegaMenuData, giftSetMegaMenuData } from '@/lib/mega-menu-data';
import { useToast } from '@/hooks/use-toast';

export default function CategoriesAdminPage() {
    const { categories, isLoading } = useCategories();
    const [filter, setFilter] = useState('all'); // 'all' or 'parents'
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

            Object.values(wineMegaMenuData).flat().forEach(item => addItemsWithParent([item], 'ruou-vang'));
            Object.values(spiritsMegaMenuData).flat().forEach(item => addItemsWithParent([item], 'ruou-manh'));
            Object.values(glasswareMegaMenuData).flat().forEach(item => addItemsWithParent(item, 'ly-coc-pha-le'));
            addItemsWithParent(giftSetMegaMenuData.quaTang, 'bo-qua-tang');
            
            const uniqueCategories = Array.from(new Map(allCategoriesToCreate.map(item => [item.id, item])).values());

            uniqueCategories.forEach(category => {
                const docRef = doc(categoriesCol, category.id);
                batch.set(docRef, category, { merge: true });
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
          <Skeleton className="h-10 w-32" />
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
            <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="parents">Chỉ danh mục cha</SelectItem>
                </SelectContent>
            </Select>
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
      <div className="mt-6">
        <DataTable columns={memoizedColumns} data={filteredCategories} />
      </div>
    </div>
  );
}
