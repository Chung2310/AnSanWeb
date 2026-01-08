'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Category } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
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
import { useState } from 'react';

const DeleteCategoryButton = ({ category, onDelete }: { category: Category, onDelete: (category: Category) => void }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(category);
        } finally {
            // It's possible the component unmounts before this runs if the table re-renders fast
            if (document.getElementById(`delete-btn-${category.id}`)) {
               setIsDeleting(false);
            }
        }
    };

    return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-destructive"
              id={`delete-btn-${category.id}`}
            >
              Xóa danh mục
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể được hoàn tác. Nó sẽ xóa vĩnh viễn danh mục.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    );
};


export const columns = (categoryMap: Map<string, string>, onDelete: (category: Category) => void): ColumnDef<Category>[] => [
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
    accessorKey: 'name',
    header: 'Tên danh mục',
  },
  {
    accessorKey: 'slug',
    header: 'Đường dẫn (Slug)',
  },
  {
    accessorKey: 'parentId',
    header: 'Danh mục cha',
    cell: ({ row }) => {
        const parentId = row.original.parentId;
        if (!parentId) return '—';
        return categoryMap.get(parentId) || 'Không tìm thấy';
    }
  },
  {
    id: 'actions',
    cell: function Cell({ row }) {
      const category = row.original;

      return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                <Link href={`/admin/categories/${category.id}/edit`}>
                    Chỉnh sửa
                </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteCategoryButton category={category} onDelete={onDelete} />
            </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
