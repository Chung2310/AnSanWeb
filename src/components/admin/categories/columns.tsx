'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Category } from '@/lib/types';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCategoryDialog } from '@/stores/use-category-dialog';
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

const DeleteCategoryAlert = ({ categoryId }: { categoryId: string }) => {
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, 'categories', categoryId));
      toast({ title: 'Thành công', description: 'Đã xóa danh mục.' });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: 'destructive',
        title: 'Có lỗi xảy ra',
        description: 'Không thể xóa danh mục. Vui lòng thử lại.',
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
            Hành động này không thể được hoàn tác. Dữ liệu danh mục sẽ bị xóa vĩnh viễn khỏi máy chủ.
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

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'image',
    header: 'Ảnh',
    cell: ({ row }) => {
      const image = row.original.image;
      return image ? (
        <Image
          src={image.url}
          alt={row.original.name}
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
    accessorKey: 'name',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên danh mục
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Badge>
      );
    }
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
      const date = row.original.createdAt;
      // @ts-ignore
      const formattedDate = date ? new Date(date.seconds * 1000).toLocaleDateString('vi-VN') : 'N/A';
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const category = row.original;
      const { onOpen } = useCategoryDialog();

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
            <DropdownMenuItem onClick={() => onOpen(category)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
                asChild
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                <DeleteCategoryAlert categoryId={category.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
