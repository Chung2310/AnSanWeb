'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductDialog } from '@/stores/use-product-dialog';
import ProductForm from '@/components/admin/products/product-form';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { columns } from '@/components/admin/products/columns';
import { DataTable } from '@/components/admin/products/data-table';

export default function AdminProductsPage() {
  const { onOpen } = useProductDialog();
  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(
    () => collection(firestore, 'products'),
    [firestore]
  );
  
  const productsQuery = useMemoFirebase(
    () => productsCollection && query(productsCollection, orderBy('createdAt', 'desc')),
    [productsCollection]
  );

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sản phẩm</h1>
          <p className="text-muted-foreground">
            Quản lý các sản phẩm của bạn.
          </p>
        </div>
        <Button onClick={() => onOpen()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm sản phẩm
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả sản phẩm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={products || []} isLoading={isLoading} />
        </CardContent>
      </Card>
      
      <ProductForm />
    </>
  );
}
