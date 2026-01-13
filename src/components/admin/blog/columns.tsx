
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { BlogPost } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
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
import { useDeleteBlogPost } from '@/hooks/use-delete-blog-post';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ActionsCell = ({ row }: { row: { original: BlogPost } }) => {
    const post = row.original;
    const { deleteBlogPost, isDeleting } = useDeleteBlogPost();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const searchParams = useSearchParams();
    const page = searchParams.get('page') ?? '1';

    const handleDelete = async () => {
        await deleteBlogPost(post);
        setIsAlertOpen(false);
    };

    return (
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
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
                        <Link href={`/tin-tuc/${post.slug}`} target="_blank">
                            Xem bài viết
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/blog/${post.id}/edit?page=${page}`}>
                            Chỉnh sửa
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            Xóa bài viết
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này không thể được hoàn tác. Nó sẽ xóa vĩnh viễn bài viết và các ảnh liên quan.
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
}

export const columns: ColumnDef<BlogPost>[] = [
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
      return image && image.url ? (
        <Image
          src={image.url}
          alt={row.original.title}
          width={80}
          height={60}
          className="h-14 w-20 rounded-md object-cover"
        />
      ) : (
        <div className="h-14 w-20 rounded-md bg-muted"></div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Tiêu đề',
  },
  {
    accessorKey: 'author',
    header: 'Tác giả',
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
    cell: ActionsCell,
  },
];
