'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visiblePageCount?: number;
}

export function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
  visiblePageCount = 5,
}: ProductPaginationProps) {
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= visiblePageCount + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [];
    const startPages = [1, 2];
    const endPages = [totalPages - 1, totalPages];
    let middlePages: number[] = [];

    const halfVisible = Math.floor(visiblePageCount / 2);
    let start = Math.max(3, currentPage - halfVisible);
    let end = Math.min(totalPages - 2, currentPage + halfVisible);

    if (currentPage - halfVisible < 3) {
      end = visiblePageCount;
    }

    if (currentPage + halfVisible > totalPages - 2) {
      start = totalPages - visiblePageCount + 1;
    }

    for (let i = start; i <= end; i++) {
        middlePages.push(i);
    }

    // Add start pages and ellipsis if needed
    if (start > 3) {
        pages.push(...startPages, '...');
    } else {
        middlePages = [1, ...middlePages];
    }
    
    // Add middle pages
    pages.push(...middlePages);

    // Add end pages and ellipsis if needed
    if (end < totalPages - 2) {
        pages.push('...', ...endPages);
    } else {
        pages.push(...endPages);
    }

    // Remove duplicates
    return [...new Set(pages)];
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Product pagination"
      className="flex items-center justify-center gap-2 mt-12 text-lg"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="transition-colors hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 font-bold text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'outline' : 'ghost'}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={cn(
              'h-auto px-4 py-2 font-headline font-bold transition-colors hover:text-foreground',
              currentPage === page
                ? 'text-foreground underline underline-offset-4'
                : 'text-muted-foreground'
            )}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="transition-colors hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </nav>
  );
}
