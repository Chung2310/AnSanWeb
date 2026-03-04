'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginatorProps {
    totalPages: number;
    onPageChange?: (page: number) => void;
}

export function Paginator({ totalPages, onPageChange }: PaginatorProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // NGUỒN SỰ THẬT DUY NHẤT: Lấy trang hiện tại từ URL
    const currentPage = Number(searchParams.get('page')) || 1;

    const handlePageClick = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', pageNumber.toString());
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
            if (onPageChange) onPageChange(pageNumber);
        }
    };

    if (totalPages <= 1) return null;

    return (
      <nav aria-label="Product pagination" className="flex items-center justify-center gap-2 mt-12 text-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="transition-colors hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[250px] sm:max-w-none">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
                key={page}
                variant={currentPage === page ? 'outline' : 'ghost'}
                onClick={() => handlePageClick(page)}
                className={cn(
                    'h-auto px-4 py-2 font-headline font-bold transition-colors hover:text-foreground', 
                    currentPage === page ? 'text-foreground underline underline-offset-4 border-black' : 'text-muted-foreground'
                )}
            >
                {page}
            </Button>
            ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="transition-colors hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </nav>
    );
}
