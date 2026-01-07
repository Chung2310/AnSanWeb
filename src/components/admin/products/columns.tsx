'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Product } from '@/lib/types';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProductDialog } from '@/stores/use-product-dialog';
import { useFirestore } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
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
} from "@/components/ui/alert-dialog";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const DeleteProductAlert = ({ productId }: { productId: string }) => {
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, 'products', productId));
      toast({ title: 'Thành công', description: 'Đã xóa sản phẩm.' });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Có lỗi xảy ra',
        description: 'Không thể xóa sản phẩm. Vui lòng thử lại.',
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive">
          Xóa
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể được hoàn tác. Dữ liệu sản phẩm sẽ bị xóa vĩnh viễn khỏi máy chủ.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<Product>[] = [
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
        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
          No Img
        </div>
      );
    },
  },
  {
    accessorKey: 'nameVN',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên sản phẩm
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: 'isFeatured',
    header: 'Trạng thái',
    cell: ({ row }) => {
        const isFeatured = row.original.isFeatured;
        const isNew = row.original.isNew;
      return (
        <div className='flex flex-col gap-1'>
            {isFeatured && <Badge variant={'default'}>Nổi bật</Badge>}
            {isNew && <Badge variant={'secondary'}>Mới</Badge>}
        </div>
      );
    }
  },
   {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Giá
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price)
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ngày tạo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.createdAt as any;
      const formattedDate = date ? new Date(date.seconds * 1000).toLocaleDateString('vi-VN') : 'N/A';
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      const { onOpen } = useProductDialog();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onOpen(product)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
                asChild
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                <DeleteProductAlert productId={product.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

    