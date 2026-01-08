'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Product } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteProduct } from '@/hooks/use-delete-product';

const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'image',
    header: 'Ảnh',
    cell: ({ row }) => {
      const image = row.original.image;
      return image ? (
        <Image
          src={image.url}
          alt={row.original.nameVN}
          width={40}
          height={40}
          className="h-10 w-10 rounded-md object-cover"
        />
      ) : (
        <div className="h-10 w-10 rounded-md bg-muted"></div>
      );
    },
  },
  {
    accessorKey: 'nameVN',
    header: 'Tên sản phẩm',
  },
  {
    accessorKey: 'price',
    header: 'Giá',
    cell: ({ row }) => formatPrice(row.original.price),
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
        const status = row.getValue('status')
        if (status === 'published') return 'Đã xuất bản'
        if (status === 'draft') return 'Bản nháp'
        return status as string
    }
  },
   {
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
     cell: ({ row }) => {
        const { createdAt } = row.original;
        if (!createdAt) return 'N/A';
        // Firestore Timestamps have a toDate method, but other date objects/strings might not.
        const date = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
        return date.toLocaleDateString('vi-VN');
    }
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: function Cell({ row }) {
      const product = row.original;
      const { deleteProduct, isDeleting } = useDeleteProduct();

      return (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Chỉnh sửa</span>
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
                <span className="sr-only">Xóa</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn sản phẩm và tất cả hình ảnh liên quan khỏi máy chủ.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteProduct(product)}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

    