'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  collection,
  doc,
  query,
  orderBy,
  Firestore,
  getDoc,
} from 'firebase/firestore';

import { Badge } from '@/components/ui/badge';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useProductDialog } from '@/components/admin/products/use-product-dialog';
import { ProductForm } from '@/components/admin/products/product-form';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

import type { Product, ProductDetail, FullProduct } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

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

  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return 'Ngày không hợp lệ';
    }
  };

  const handleCreate = () => {
    onOpen();
  };

  const handleEdit = async (product: Product) => {
    if (!firestore) return;
    const detailDocRef = doc(firestore, 'product_details', product.id);
    const detailSnap = await getDoc(detailDocRef);
    const detailData = detailSnap.exists() ? detailSnap.data() as ProductDetail : null;

    const fullProduct: FullProduct = {
      ...product,
      ...(detailData || { description: '' }),
    };

    onOpen(product.id, fullProduct);
  };

  const handleDelete = (product: Product) => {
    setDeleteCandidate(product);
  };

  const confirmDelete = async () => {
    if (!deleteCandidate || !firestore) return;
    const productDocRef = doc(firestore, 'products', deleteCandidate.id);
    const detailDocRef = doc(firestore, 'product_details', deleteCandidate.id);
    
    await deleteDocumentNonBlocking(productDocRef);
    await deleteDocumentNonBlocking(detailDocRef);
    setDeleteCandidate(null);
  };

  return (
    <>
      <ProductForm />
      <AlertDialog
        open={!!deleteCandidate}
        onOpenChange={(open) => !open && setDeleteCandidate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể được hoàn tác. Sản phẩm "
              {deleteCandidate?.nameVN}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Quản lý Sản phẩm
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Thêm Sản phẩm
              </span>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>
              Xem, quản lý, thêm hoặc xóa các sản phẩm của bạn.
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
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="hidden md:table-cell">Giá</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Ngày tạo
                  </TableHead>
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
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
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
                      <Badge variant="outline">Còn hàng</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(product.createdAt)}
                    </TableCell>
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
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product)}
                          >
                            Xóa
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

    