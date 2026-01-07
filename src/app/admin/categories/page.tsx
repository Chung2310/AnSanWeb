'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategoryDialog } from '@/stores/use-category-dialog';
import CategoryForm from '@/components/admin/categories/category-form';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import { columns } from '@/components/admin/categories/columns';
import { DataTable } from '@/components/admin/categories/data-table';

export default function AdminCategoriesPage() {
  const { onOpen } = useCategoryDialog();
  const firestore = useFirestore();

  const categoriesCollection = useMemoFirebase(
    () => collection(firestore, 'categories'),
    [firestore]
  );
  
  const categoriesQuery = useMemoFirebase(
    () => categoriesCollection && query(categoriesCollection, orderBy('createdAt', 'desc')),
    [categoriesCollection]
  );

  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Danh mục</h1>
          <p className="text-muted-foreground">
            Quản lý các danh mục sản phẩm của bạn.
          </p>
        </div>
        <Button onClick={() => onOpen()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả danh mục sản phẩm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories || []} isLoading={isLoading} />
        </CardContent>
      </Card>
      
      <CategoryForm />
    </>
  );
}
