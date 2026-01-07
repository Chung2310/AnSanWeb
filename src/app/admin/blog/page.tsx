'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  collection,
  doc,
  query,
  orderBy,
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
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlogDialog } from '@/components/admin/blog/use-blog-dialog';
import { BlogForm } from '@/components/admin/blog/blog-form';

export default function AdminBlogPage() {
  const { onOpen } = useBlogDialog();
  const firestore = useFirestore();

  const postsCollection = useMemoFirebase(
    () => collection(firestore, 'blogPosts'),
    [firestore]
  );
  const postsQuery = useMemoFirebase(
    () => postsCollection && query(postsCollection, orderBy('date', 'desc')),
    [postsCollection]
  );
  
  const { data: posts, isLoading } = useCollection<BlogPost>(postsQuery);

  const [deleteCandidate, setDeleteCandidate] = useState<BlogPost | null>(null);

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

  const handleEdit = (post: BlogPost) => {
    onOpen(post.id, post);
  };

  const handleDelete = (post: BlogPost) => {
    setDeleteCandidate(post);
  };

  const confirmDelete = () => {
    if (!deleteCandidate || !firestore) return;
    const docRef = doc(firestore, 'blogPosts', deleteCandidate.id);
    deleteDocumentNonBlocking(docRef);
  };

  return (
    <>
      <BlogForm />
      <AlertDialog
        open={!!deleteCandidate}
        onOpenChange={(open) => !open && setDeleteCandidate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể được hoàn tác. Bài viết "
              {deleteCandidate?.title}" sẽ bị xóa vĩnh viễn.
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
            Quản lý Bài viết
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Thêm Bài viết
              </span>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài viết</CardTitle>
            <CardDescription>
              Xem, quản lý, thêm hoặc xóa các bài viết kiến thức của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Ảnh</span>
                  </TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Ngày đăng
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
                    <TableCell>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && posts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={post.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={post.image?.imageUrl || '/placeholder.svg'}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.author}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(post.date)}
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
                          <DropdownMenuItem onClick={() => handleEdit(post)}>
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(post)}
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
              Hiển thị <strong>1-{posts?.length ?? 0}</strong> trên{' '}
              <strong>{posts?.length ?? 0}</strong> bài viết
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
