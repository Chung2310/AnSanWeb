'use client';

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({ currentPage, totalPages, onPageChange }: ProductPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Product pagination" className="flex items-center justify-center gap-2 mt-12 text-lg">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="transition-colors hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <Button
          key={page}
          variant={currentPage === page ? 'outline' : 'ghost'}
          onClick={() => onPageChange(page)}
          className={cn(
            'h-auto px-4 py-2 font-headline font-bold transition-colors hover:text-foreground',
            currentPage === page ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground'
          )}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="transition-colors hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </nav>
  );
}
