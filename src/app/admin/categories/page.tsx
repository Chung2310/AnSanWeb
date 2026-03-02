'use client';
import { Button } from '@/components/ui/button';
import { Filter, Download, FileUp, X } from 'lucide-react';
import { DataTable } from '@/components/admin/categories/data-table';
import { columns } from '@/components/admin/categories/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useState, useMemo, useRef } from 'react';
import type { Category } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';
import { useImportCategories } from '@/hooks/use-import-categories';

export default function CategoriesAdminPage() {
    const { categories, isLoading } = useCategories();
    const [viewFilter, setViewFilter] = useState('all'); // 'all' or 'parents'
    const [rootFilter, setRootFilter] = useState('all'); // id of root category or 'all'
    const [nameFilter, setNameFilter] = useState('');
    const { toast } = useToast();
    const { importCategories, isImporting: isImportingCategories } = useImportCategories();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const categoryMap = useMemo(() => {
      if (!categories) return new Map<string, string>();
      return new Map(categories.map(c => [c.id, c.name]));
    }, [categories]);

    const rootCategories = useMemo(() => {
        if (!categories) return [];
        return categories.filter(c => !c.parentId);
    }, [categories]);
    
    const filteredCategories = useMemo(() => {
        if (!categories) return [];
        let temp = [...categories];

        // 1. Filter by View (All vs Parents)
        if (viewFilter === 'parents') {
          temp = temp.filter(c => !c.parentId);
        }

        // 2. Filter by Root Category
        if (rootFilter !== 'all') {
            const getDescendantIds = (parentId: string, all: Category[]): string[] => {
                let ids = [parentId];
                const children = all.filter(c => c.parentId === parentId);
                children.forEach(child => {
                    ids = [...ids, ...getDescendantIds(child.id, all)];
                });
                return ids;
            };
            const allowedIds = new Set(getDescendantIds(rootFilter, categories));
            temp = temp.filter(c => allowedIds.has(c.id));
        }

        // 3. Filter by Name
        if (nameFilter) {
            const lower = nameFilter.toLowerCase();
            temp = temp.filter(c => c.name.toLowerCase().includes(lower));
        }

        return temp;
    }, [categories, viewFilter, rootFilter, nameFilter]);

    const handleExport = () => {
        if (!categories || categories.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Không có dữ liệu',
                description: 'Không có danh mục nào để xuất.',
            });
            return;
        }

        const dataToExport = categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            parentId: cat.parentId || '',
            description: cat.description || '',
            tags: (cat.tags || []).join(','),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
        XLSX.writeFile(workbook, "danh-muc.xlsx");
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await importCategories(file);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
  
    const memoizedColumns = useMemo(() => columns(categoryMap), [categoryMap]);

    if (isLoading && !categories) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-48" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold">Content Seo</h1>
                <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={handleExport} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isImportingCategories}
                    >
                        <FileUp className="mr-2 h-4 w-4" />
                        {isImportingCategories ? 'Đang nhập...' : 'Nhập Excel'}
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileSelect}
                    />
                </div>
            </div>

            <Accordion type="single" collapsible className="bg-card border rounded-lg overflow-hidden shadow-sm">
                <AccordionItem value="filters" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-2 font-semibold">
                            <Filter className="h-4 w-4" />
                            <span>Bộ lọc danh mục ({filteredCategories.length} kết quả)</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Search by Name */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold uppercase text-muted-foreground">Tìm theo tên</Label>
                                <div className="relative">
                                    <Input 
                                        placeholder="Nhập tên danh mục..."
                                        value={nameFilter}
                                        onChange={(e) => setNameFilter(e.target.value)}
                                        className="pr-8"
                                    />
                                    {nameFilter && (
                                        <button 
                                            onClick={() => setNameFilter('')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Main Category Filter */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold uppercase text-muted-foreground">Phân loại gốc</Label>
                                <RadioGroup value={rootFilter} onValueChange={setRootFilter} className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="root-all" />
                                        <Label htmlFor="root-all" className="font-normal cursor-pointer text-xs">Tất cả</Label>
                                    </div>
                                    {rootCategories.map((cat) => (
                                        <div key={cat.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={cat.id} id={`root-${cat.id}`} />
                                            <Label htmlFor={`root-${cat.id}`} className="font-normal cursor-pointer text-xs line-clamp-1">{cat.name}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* View Filter */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold uppercase text-muted-foreground">Hiển thị</Label>
                                <RadioGroup value={viewFilter} onValueChange={setViewFilter} className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="view-all" />
                                        <Label htmlFor="view-all" className="font-normal cursor-pointer text-xs">Tất cả danh mục</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="parents" id="view-parents" />
                                        <Label htmlFor="view-parents" className="font-normal cursor-pointer text-xs">Chỉ danh mục cấp 1</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                    setViewFilter('all');
                                    setRootFilter('all');
                                    setNameFilter('');
                                }}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <DataTable columns={memoizedColumns} data={filteredCategories} />
        </div>
    );
}
