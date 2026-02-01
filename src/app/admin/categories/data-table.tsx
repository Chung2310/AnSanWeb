
'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  RowSelectionState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Trash } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
import { useDeleteCategory } from '@/hooks/use-delete-category';
import type { Category } from '@/lib/types';


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  nameFilter?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  nameFilter,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { deleteCategory, isDeleting } = useDeleteCategory();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: parseInt(page, 10) - 1,
        pageSize: 15,
      },
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
    enableRowSelection: true,
  });

  useEffect(() => {
    table.getColumn('name')?.setFilterValue(nameFilter);
  }, [nameFilter, table]);

  useEffect(() => {
    const currentPageFromUrl = parseInt(page, 10);
    const tablePageIndex = table.getState().pagination.pageIndex + 1;
    if (currentPageFromUrl !== tablePageIndex) {
       table.setPageIndex(currentPageFromUrl - 1);
    }
  }, [page, table]);


  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      router.push(`${pathname}?page=${pageNumber}`);
    }
  };

  const handleDeleteSelected = () => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    const promises = selectedRows.map(row => 
        deleteCategory(row.original as Category)
    );
    Promise.all(promises).then(() => {
        table.resetRowSelection();
    });
  };

  return (
    <div className="rounded-md border bg-card">
       {table.getSelectedRowModel().flatRows.length > 0 && (
         <div className="p-4">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                        <Trash className="mr-2 h-4 w-4" />
                        Xóa ({table.getSelectedRowModel().flatRows.length})
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa vĩnh viễn các danh mục đã chọn và các danh mục con của chúng. Các sản phẩm liên quan cũng sẽ được cập nhật.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSelected}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
       )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Không có kết quả.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
       <div className="flex items-center justify-end space-x-2 p-4">
         {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-4 text-lg text-muted-foreground">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <Button
                        key={pageNumber}
                        variant="ghost"
                        onClick={() => handlePageChange(pageNumber)}
                        className={cn(
                            "font-headline font-bold transition-colors hover:text-foreground",
                            currentPage === pageNumber ? "text-foreground underline underline-offset-4" : ""
                        )}
                    >
                        {pageNumber}
                    </Button>
                ))}
                <Button
                    variant="ghost"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!table.getCanNextPage()}
                    className="transition-colors hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
