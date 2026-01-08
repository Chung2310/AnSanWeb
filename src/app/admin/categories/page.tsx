'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/admin/categories/data-table';
import { columns } from '@/components/admin/categories/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useEffect } from 'react';
import { writeBatch, collection, doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import slugify from 'slugify';

// Data based on header navigation
const initialCategoryData = [
    { name: 'RƯỢU VANG', children: [
        { name: 'VANG Ý', children: [
            { name: 'VANG VÙNG PIEMONTE' },
            { name: 'VANG VÙNG TOSCANA' },
            { name: 'VANG VÙNG VENETO' },
            { name: 'VANG VÙNG PUGLIA' },
            { name: 'VANG VÙNG SICILIA' },
        ]},
        { name: 'VANG PHÁP' },
        { name: 'VANG TÂY BAN NHA' },
        { name: 'VANG ÚC' },
        { name: 'VANG NGA' },
        { name: 'VANG ĐỨC' },
    ]},
    { name: 'RƯỢU MẠNH', children: [
        { name: "BALLANTINE'S" },
        { name: 'JOHN WALKER' },
        { name: 'MORTLACH' },
        { name: 'CHIVAS' },
        { name: 'ROYAL SALUTE' },
        { name: 'THE SINGLETON' },
    ]},
    { name: 'CIGAR', children: [
        { name: 'Cigar Hanos' },
        { name: 'Cigar Lotus' },
        { name: "Cigar Vinaboss's" },
    ]},
    { name: 'BỘ QUÀ TẶNG' },
    { name: 'KHẮC TÊN LÊN CHAI' },
];

export default function CategoriesAdminPage() {
    const { categories, isLoading } = useCategories();
    const { firestore } = useFirebase();

    useEffect(() => {
        // Function to populate initial categories if the collection is empty
        const populateInitialCategories = async () => {
            if (categories && categories.length === 0 && firestore) {
                console.log('Populating initial categories...');
                const batch = writeBatch(firestore);
                const categoriesCollectionRef = collection(firestore, 'categories');

                const addCategoriesRecursive = async (categoryList: any[], parentId: string | null) => {
                    for (const cat of categoryList) {
                        const slug = slugify(cat.name, { lower: true, strict: true, locale: 'vi' });
                        // Correctly generate a new document reference with an auto-id
                        const newDocRef = doc(categoriesCollectionRef);
                        
                        batch.set(newDocRef, {
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
                    // Optionally, trigger a refresh of the categories list
                    window.location.reload();
                } catch (error) {
                    console.error('Error populating initial categories:', error);
                }
            }
        };

        if (!isLoading) {
            populateInitialCategories();
        }
    }, [categories, isLoading, firestore]);

  if (isLoading) {
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
        <Button asChild>
          <Link href="/admin/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm danh mục mới
          </Link>
        </Button>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={categories || []} />
      </div>
    </div>
  );
}
