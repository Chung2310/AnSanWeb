'use client';

import { useState } from 'react';
import Image from 'next/image';
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

import { sampleWines } from '@/lib/placeholder-data';
import type { Wine } from '@/lib/types';

export default function AdminProductsPage() {
  const { onOpen } = useProductDialog();
  const [products, setProducts] = useState<Wine[]>(() =>
    sampleWines.sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    )
  );

  const [deleteCandidate, setDeleteCandidate] = useState<Wine | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleCreate = () => {
    onOpen();
  };

  const handleEdit = (product: Wine) => {
    onOpen(product.id, product);
  };
  
  const handleDelete = (product: Wine) => {
    setDeleteCandidate(product);
  }

  const confirmDelete = () => {
    if (!deleteCandidate) return;
    // In a real app, you'd call an API to delete the product
    // For now, we'll just filter it out from the local state
    setProducts(prev => prev.filter(p => p.id !== deleteCandidate.id));
    setDeleteCandidate(null);
  }


  return (
    <>
      <ProductForm />
       <AlertDialog open={!!deleteCandidate} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể được hoàn tác. Sản phẩm "{deleteCandidate?.nameVN}" sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Tiếp tục</AlertDialogAction>
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
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.nameVN}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.image.imageUrl}
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
                          <DropdownMenuItem onClick={() => handleDelete(product)}>Xóa</DropdownMenuItem>
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
              Hiển thị <strong>1-{products.length}</strong> trên{' '}
              <strong>{products.length}</strong> sản phẩm
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
