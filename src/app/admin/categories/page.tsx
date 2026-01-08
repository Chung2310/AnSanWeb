'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/admin/categories/data-table';
import { columns } from '@/components/admin/categories/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useEffect, useMemo, useCallback } from 'react';
import { writeBatch, collection, doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import slugify from 'slugify';
import type { Category } from '@/lib/types';
import { useDeleteCategory } from '@/hooks/use-delete-category';

// Data based on header navigation
const initialCategoryData = [
    { name: 'RƯỢU VANG', slug: 'ruou-vang', children: [
        { name: 'VANG Ý', slug: 'vang-y', children: [
            { name: 'Organic grande alberone', slug: 'organic-grande-alberone' },
            { name: 'SPARKLING', slug: 'sparkling' },
        ]},
        { name: 'VANG PHÁP', slug: 'vang-phap' },
        { name: 'VANG TÂY BAN NHA', slug: 'vang-tay-ban-nha' },
        { name: 'VANG ÚC', slug: 'vang-uc' },
        { name: 'VANG NGA', slug: 'vang-nga' },
        { name: 'VANG ĐỨC', slug: 'vang-duc' },
    ]},
    { name: 'RƯỢU MẠNH', slug: 'ruou-manh', children: [
        { name: "BALLANTINE'S", slug: 'ballantines' },
        { name: 'JOHN WALKER', slug: 'john-walker' },
        { name: 'MORTLACH', slug: 'mortlach' },
        { name: 'CHIVAS', slug: 'chivas' },
        { name: 'ROYAL SALUTE', slug: 'royal-salute' },
        { name: 'THE SINGLETON', slug: 'the-singleton' },
    ]},
    { name: 'CIGAR', slug: 'cigar', children: [
        { name: 'Cigar Hanos', slug: 'cigar-hanos' },
        { name: 'Cigar Lotus', slug: 'cigar-lotus' },
        { name: "Cigar Vinaboss's", slug: 'cigar-vinaboss' },
    ]},
    { name: 'BỘ QUÀ TẶNG', slug: 'bo-qua-tang' },
    { name: 'KHẮC TÊN LÊN CHAI', slug: 'khac-ten-len-chai' },
];

export default function CategoriesAdminPage() {
    const { categories, isLoading } = useCategories();
    const { firestore } = useFirebase();
    
    const categoryMap = useMemo(() => {
      if (!categories) return new Map<string, string>();
      return new Map(categories.map(c => [c.id, c.name]));
    }, [categories]);

    useEffect(() => {
        // Function to populate initial categories if the collection is empty
        const populateInitialCategories = async () => {
            if (categories && categories.length === 0 && firestore) {
                console.log('Populating initial categories...');
                const batch = writeBatch(firestore);
                const categoriesCollectionRef = collection(firestore, 'categories');

                const addCategoriesRecursive = async (categoryList: any[], parentId: string | null) => {
                    for (const cat of categoryList) {
                        const slug = cat.slug || slugify(cat.name, { lower: true, strict: true, locale: 'vi' });
                        const newDocRef = doc(categoriesCollectionRef);
                        
                        batch.set(newDocRef, {
                            id: newDocRef.id,
                            name: cat.name,
                            slug: slug,
                            parentId: parentId,
                        });

                        if (cat.children && cat.children.length > 0) {
                            await addCategoriesRecursive(cat.children, newDocRef.id);
                        }
                    }
                };

                await addCategoriesRecursive(initialCategoryData, null);

                try {
                    await batch.commit();
                    console.log('Initial categories populated successfully.');
                    // The useCategories hook will automatically refetch, no need to reload
                } catch (error) {
                    console.error('Error populating initial categories:', error);
                }
            }
        };

        if (!isLoading && categories?.length === 0) {
            populateInitialCategories();
        }
    }, [categories, isLoading, firestore]);

  
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

  const tableData: Category[] = categories || [];


  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Danh mục sản phẩm</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm danh mục mới
          </Link>
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={memoizedColumns} data={tableData} />
      </div>
    </div>
  );
}
