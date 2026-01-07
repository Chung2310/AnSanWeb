
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  collection,
  doc,
  query,
  orderBy,
  getDoc,
} from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { useProductDetailDialog } from '@/components/admin/product-details/use-product-detail-dialog';
import { ProductDetailForm } from '@/components/admin/product-details/product-detail-form';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';

import type { Product, ProductDetail, FullProduct } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductDetailsPage() {
  const { onOpen } = useProductDetailDialog();
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

  const handleEdit = async (product: Product) => {
    if (!firestore) return;
    const detailDocRef = doc(firestore, 'product_details', product.id);
    const detailSnap = await getDoc(detailDocRef);
    const detailData = detailSnap.exists() ? detailSnap.data() as ProductDetail : null;

    const fullProductData: FullProduct = {
      ...product,
      ...(detailData || { 
          id: product.id, 
          description: '', 
          detailImage: null, 
          tastingNotes: null, 
          productDetails: null 
      }),
    };

    onOpen(product.id, fullProductData);
  };

  return (
    <>
      <ProductDetailForm />
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Quản lý Chi tiết Sản phẩm
          </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>
              Quản lý thông tin chi tiết của sản phẩm (mô tả, ảnh chi tiết, tasting notes...).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Ảnh</span>
                  </TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>
                    <span className="sr-only">Hành động</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="hidden sm:table-cell">
                       <Skeleton className="h-16 w-16 rounded-md" />
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                    <TableCell>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.nameVN}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.image?.url || '/placeholder.svg'}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.nameVN}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            Chỉnh sửa Chi tiết
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Hiển thị <strong>1-{products?.length ?? 0}</strong> trên{' '}
              <strong>{products?.length ?? 0}</strong> sản phẩm
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
