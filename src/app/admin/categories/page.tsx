'use client';
import { Button } from '@/components/ui/button';
import { Filter, PlusCircle, Download, FileUp } from 'lucide-react';
import Link from 'next/link';
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
import { useFirestore } from '@/firebase/provider';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { wineMegaMenuData, spiritsMegaMenuData, glasswareMegaMenuData, giftSetMegaMenuData } from '@/lib/mega-menu-data';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';
import { useImportCategories } from '@/hooks/use-import-categories';

export default function CategoriesAdminPage() {
    const { categories, isLoading } = useCategories();
    const [filter, setFilter] = useState('all'); // 'all' or 'parents'
    const [nameFilter, setNameFilter] = useState('');
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isRestoring, setIsRestoring] = useState(false);
    const { importCategories, isImporting: isImportingCategories } = useImportCategories();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const categoryMap = useMemo(() => {
      if (!categories) return new Map<string, string>();
      return new Map(categories.map(c => [c.id, c.name]));
    }, [categories]);
    
    const filteredCategories = useMemo(() => {
        if (!categories) return [];
        if (filter === 'parents') {
          return categories.filter(c => !c.parentId);
        }
        return categories;
    }, [categories, filter]);

    const handleRestore = async () => {
        setIsRestoring(true);
        toast({ title: 'Đang khôi phục danh mục...' });

        try {
            const batch = writeBatch(firestore);
            const categoriesCol = collection(firestore, 'categories');

            const allCategoriesToCreate: Omit<Category, 'createdAt' | 'updatedAt' | 'status' | 'image'>[] = [];

            // 1. Root Categories
            const rootCats = [
                { id: 'ruou-vang', name: 'Rượu Vang', slug: 'ruou-vang', parentId: null },
                { id: 'ruou-manh', name: 'Rượu Mạnh', slug: 'ruou-manh', parentId: null },
                { id: 'ly-coc-pha-le', name: 'Ly - Cốc Pha Lê', slug: 'ly-coc-pha-le', parentId: null },
                { id: 'bo-qua-tang', name: 'Bộ Quà Tặng', slug: 'bo-qua-tang', parentId: null },
                { id: 'cigar', name: 'Cigar', slug: 'cigar', parentId: null },
            ];
            rootCats.forEach(cat => allCategoriesToCreate.push({ ...cat, description: '', tags: [] }));

            // 2. Intermediate Group Categories
            const groupCats = [
                // Rượu Vang groups
                { id: 'vang-theo-loai', name: 'Theo loại rượu', slug: 'vang-theo-loai', parentId: 'ruou-vang' },
                { id: 'vang-theo-quoc-gia', name: 'Theo quốc gia', slug: 'vang-theo-quoc-gia', parentId: 'ruou-vang' },
                { id: 'vang-theo-vung', name: 'Vùng làm vang', slug: 'vang-theo-vung', parentId: 'ruou-vang' },
                { id: 'vang-theo-giong-nho', name: 'Giống nho', slug: 'vang-theo-giong-nho', parentId: 'ruou-vang' },
                // Rượu Mạnh groups
                { id: 'manh-theo-loai', name: 'Loại Rượu', slug: 'manh-theo-loai', parentId: 'ruou-manh' },
                { id: 'manh-thuong-hieu', name: 'Thương hiệu', slug: 'manh-thuong-hieu', parentId: 'ruou-manh' },
                // Ly groups
                { id: 'ly-riedel', name: 'LY PHA LÊ RIEDEL', slug: 'ly-riedel', parentId: 'ly-coc-pha-le' },
                { id: 'ly-whisky', name: 'LY WHISKY', slug: 'ly-whisky', parentId: 'ly-coc-pha-le' },
                { id: 'ly-khac', name: 'KHÁC', slug: 'ly-khac', parentId: 'ly-coc-pha-le' },
                // Quà tặng groups
                { id: 'qua-tang-loai', name: 'Loại quà tặng', slug: 'qua-tang-loai', parentId: 'bo-qua-tang' },
            ];
            groupCats.forEach(cat => allCategoriesToCreate.push({ ...cat, description: '', tags: [] }));
            
            const addItemsWithParent = (items: { label: string; slug: string; category_id: string }[], parentId: string) => {
              items.forEach(item => {
                allCategoriesToCreate.push({
                  id: item.category_id,
                  name: item.label,
                  slug: item.slug,
                  description: '',
                  tags: [],
                  parentId: parentId,
                });
              });
            };
            
            // 3. Add Leaf Categories
            addItemsWithParent(wineMegaMenuData.theoLoai, 'vang-theo-loai');
            addItemsWithParent(wineMegaMenuData.theoQuocGia, 'vang-theo-quoc-gia');
            addItemsWithParent(wineMegaMenuData.theoVung, 'vang-theo-vung');
            addItemsWithParent(wineMegaMenuData.theoGiongNho, 'vang-theo-giong-nho');

            addItemsWithParent(spiritsMegaMenuData.theoLoai, 'manh-theo-loai');
            addItemsWithParent(spiritsMegaMenuData.thuongHieu, 'manh-thuong-hieu');
            
            addItemsWithParent(glasswareMegaMenuData.lyPhaLeRiedel, 'ly-riedel');
            addItemsWithParent(glasswareMegaMenuData.lyWhisky, 'ly-whisky');
            addItemsWithParent(glasswareMegaMenuData.khac, 'ly-khac');
            
            addItemsWithParent(giftSetMegaMenuData.quaTang, 'qua-tang-loai');
            
            const uniqueCategories = Array.from(new Map(allCategoriesToCreate.map(item => [item.id, item])).values());

            uniqueCategories.forEach(category => {
                const docRef = doc(categoriesCol, category.id);
                batch.set(docRef, { ...category, description: category.description || '' }, { merge: true });
            });

            await batch.commit();

            toast({ title: 'Thành công!', description: `${uniqueCategories.length} danh mục đã được khôi phục và đồng bộ cấu trúc mới.` });

        } catch (error) {
            console.error("Error restoring categories:", error);
            toast({
                variant: 'destructive',
                title: 'Lỗi',
                description: 'Không thể khôi phục danh mục.',
            });
        } finally {
            setIsRestoring(false);
        }
    };

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
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>
        <div className="my-4">
             <Skeleton className="h-14 w-full" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Seo</h1>
         <div className="flex flex-wrap items-center gap-4">
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
            <Button
                variant="outline"
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
            <Button onClick={handleRestore} disabled={isRestoring} variant="outline">
                {isRestoring ? 'Đang khôi phục...' : 'Khôi phục mặc định'}
            </Button>
            <Button asChild>
            <Link href="/admin/categories/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm mới
            </Link>
            </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="my-4 bg-card p-4 rounded-md border">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger>
            <div className='flex items-center gap-2 text-base font-semibold'>
              <Filter className="h-4 w-4" />
              <span>Lọc danh mục ({filteredCategories.length} / {categories?.length || 0} kết quả)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-4">
                    <h4 className='font-semibold text-base border-b pb-2'>Tìm theo tên</h4>
                     <Input 
                        placeholder="Tên danh mục..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </div>
                <div className="space-y-4">
                    <h4 className='font-semibold text-base border-b pb-2'>Hiển thị</h4>
                    <RadioGroup value={filter} onValueChange={setFilter} className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="cat-all" />
                            <Label htmlFor="cat-all" className="font-normal cursor-pointer">Tất cả danh mục</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="parents" id="cat-parents" />
                            <Label htmlFor="cat-parents" className="font-normal cursor-pointer">Chỉ danh mục cha</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="button" variant="secondary" onClick={() => {
                  setFilter('all');
                  setNameFilter('');
              }}>Xóa bộ lọc</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6">
        <DataTable columns={memoizedColumns} data={filteredCategories || []} nameFilter={nameFilter} />
      </div>
    </div>
  );
}
