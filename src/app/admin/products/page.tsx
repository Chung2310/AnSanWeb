'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, Download, FileUp, X } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/hooks/use-products';
import { DataTable } from '@/components/admin/products/data-table';
import { columns } from '@/components/admin/products/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Category } from '@/lib/types';
import * as XLSX from 'xlsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { wineMegaMenuData, spiritsMegaMenuData, glasswareMegaMenuData, giftSetMegaMenuData } from '@/lib/mega-menu-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useImportProducts } from '@/hooks/use-import-products';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';

// Define filter types
type WineFilters = {
  theoLoai: string[];
  theoQuocGia: string[];
  theoVung: string[];
  theoGiongNho: string[];
};

type SpiritFilters = {
  theoLoai: string[];
  thuongHieu: string[];
};

type GlasswareFilters = {
  lyPhaLeRiedel: string[];
  lyWhisky: string[];
  khac: string[];
};

type GiftSetFilters = {
  quaTang: string[];
};


export default function ProductsAdminPage() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const { importProducts, isImporting } = useImportProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [wineFilters, setWineFilters] = useState<WineFilters>({
    theoLoai: [],
    theoQuocGia: [],
    theoVung: [],
    theoGiongNho: [],
  });

  const [spiritFilters, setSpiritFilters] = useState<SpiritFilters>({
    theoLoai: [],
    thuongHieu: [],
  });

  const [glasswareFilters, setGlasswareFilters] = useState<GlasswareFilters>({
    lyPhaLeRiedel: [],
    lyWhisky: [],
    khac: [],
  });

  const [giftSetFilters, setGiftSetFilters] = useState<GiftSetFilters>({
    quaTang: [],
  });

  const mainProductCategories = useMemo(() => {
    if (!categories) return [];
    const slugs = ['ruou-vang', 'ruou-manh', 'ly-coc-pha-le', 'bo-qua-tang', 'cigar'];
    return slugs.map(slug => categories.find(c => c.slug === slug)).filter((c): c is Category => !!c);
  }, [categories]);

  const wineCategory = useMemo(() => categories?.find(c => c.slug === 'ruou-vang'), [categories]);
  const spiritCategory = useMemo(() => categories?.find(c => c.slug === 'ruou-manh'), [categories]);
  const glasswareCategory = useMemo(() => categories?.find(c => c.slug === 'ly-coc-pha-le'), [categories]);
  const giftSetCategory = useMemo(() => categories?.find(c => c.slug === 'bo-qua-tang'), [categories]);

  const isWineCategorySelected = selectedCategoryId === wineCategory?.id;
  const isSpiritCategorySelected = selectedCategoryId === spiritCategory?.id;
  const isGlasswareCategorySelected = selectedCategoryId === glasswareCategory?.id;
  const isGiftSetCategorySelected = selectedCategoryId === giftSetCategory?.id;

  useEffect(() => {
    if (!isWineCategorySelected) setWineFilters({ theoLoai: [], theoQuocGia: [], theoVung: [], theoGiongNho: [] });
    if (!isSpiritCategorySelected) setSpiritFilters({ theoLoai: [], thuongHieu: [] });
    if (!isGlasswareCategorySelected) setGlasswareFilters({ lyPhaLeRiedel: [], lyWhisky: [], khac: [] });
    if (!isGiftSetCategorySelected) setGiftSetFilters({ quaTang: [] });
  }, [selectedCategoryId, isWineCategorySelected, isSpiritCategorySelected, isGlasswareCategorySelected, isGiftSetCategorySelected]);


  const getDescendantIds = useCallback((parentId: string, allCategories: Category[]): string[] => {
    const descendantIds: string[] = [];
    const queue: string[] = [parentId];
    const visited: Set<string> = new Set();
    
    const parentCategory = allCategories.find(cat => cat.id === parentId);
    if(parentCategory) {
       visited.add(parentCategory.id);
       if(parentCategory.slug) visited.add(parentCategory.slug);
    }

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = allCategories.filter(cat => cat.parentId === currentId);
      for (const child of children) {
        if (!visited.has(child.id)) {
          descendantIds.push(child.id);
          if (child.slug) descendantIds.push(child.slug);
          queue.push(child.id);
          visited.add(child.id);
        }
      }
    }
    return descendantIds;
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products || !categories) return [];
    let tempProducts = [...products];

    // 1. Filter by main category
    if (selectedCategoryId !== 'all') {
      const selectedCategory = categories.find(c => c.id === selectedCategoryId);
      if (selectedCategory) {
        const allChildIds = getDescendantIds(selectedCategoryId, categories);
        const categoryIdsToFilter = [selectedCategoryId, selectedCategory.slug, ...allChildIds].filter(Boolean);
        tempProducts = tempProducts.filter((p) => 
          p.tags?.some(tagId => categoryIdsToFilter.includes(tagId))
        );
      }
    }

    // 2. Detailed Filters
    const applyDetailedFilters = (filters: any) => {
        const activeFilterGroups = Object.keys(filters).filter(groupKey => filters[groupKey].length > 0);
        if (activeFilterGroups.length === 0) return;
        
        tempProducts = tempProducts.filter(p => {
            const productTags = new Set(p.tags || []);
            return activeFilterGroups.every(groupKey => {
                const groupFilters = filters[groupKey] as string[];
                return groupFilters.some(tag => productTags.has(tag));
            });
        });
    };

    if (isWineCategorySelected) applyDetailedFilters(wineFilters);
    if (isSpiritCategorySelected) applyDetailedFilters(spiritFilters);
    if (isGlasswareCategorySelected) applyDetailedFilters(glasswareFilters);
    if (isGiftSetCategorySelected) applyDetailedFilters(giftSetFilters);
    
    return tempProducts;
  }, [products, categories, selectedCategoryId, getDescendantIds, isWineCategorySelected, wineFilters, isSpiritCategorySelected, spiritFilters, isGlasswareCategorySelected, glasswareFilters, isGiftSetCategorySelected, giftSetFilters]);

  const isLoading = isLoadingProducts || isLoadingCategories;
  
  const handleWineFilterChange = (group: keyof WineFilters, tagId: string, checked: boolean) => {
    setWineFilters(prev => ({ ...prev, [group]: checked ? [...prev[group], tagId] : prev[group].filter(i => i !== tagId) }));
  };

  const handleSpiritFilterChange = (group: keyof SpiritFilters, tagId: string, checked: boolean) => {
    setSpiritFilters(prev => ({ ...prev, [group]: checked ? [...prev[group], tagId] : prev[group].filter(i => i !== tagId) }));
  };

  const handleGlasswareFilterChange = (group: keyof GlasswareFilters, tagId: string, checked: boolean) => {
    setGlasswareFilters(prev => ({ ...prev, [group]: checked ? [...prev[group], tagId] : prev[group].filter(i => i !== tagId) }));
  };

  const handleGiftSetFilterChange = (group: keyof GiftSetFilters, tagId: string, checked: boolean) => {
    setGiftSetFilters(prev => ({ ...prev, [group]: checked ? [...prev[group], tagId] : prev[group].filter(i => i !== tagId) }));
  };

  const handleExport = () => {
    if (!filteredProducts || filteredProducts.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Không có dữ liệu',
            description: 'Không có sản phẩm nào đang hiển thị để xuất.',
        });
        return;
    }

    const dataToExport = filteredProducts.map(prod => {
        // Extract the combined category string for display
        const categoryAttr = prod.attributes?.find(a => a.label === 'Danh mục / Phân loại');
        const categoryValue = categoryAttr ? categoryAttr.value : '';

        const row: any = {
            'ID': prod.id,
            'Tên sản phẩm': prod.nameVN,
            'Đường dẫn (slug)': prod.slug,
            'Giá': prod.price,
            'Mô tả giá': prod.priceDescription || '',
            'Giá phụ': prod.secondaryPrice || '',
            'Mô tả giá phụ': prod.secondaryPriceDescription || '',
            'Trạng thái': prod.status === 'published' ? 'Đã xuất bản' : 'Bản nháp',
            'Nổi bật': prod.isFeatured ? 'Có' : 'Không',
            'Giá tốt': prod.isGoodPrice ? 'Có' : 'Không',
            'Sản phẩm mới': prod.isNew ? 'Có' : 'Không',
            'Lựa chọn tốt nhất': prod.bestChoice ? 'Có' : 'Không',
            'Danh mục / Phân loại': categoryValue,
            'Mô tả ngắn': prod.shortDescription || '',
            'Mô tả chi tiết': prod.description || '',
            'URL Ảnh bìa': prod.image?.url || '',
            'URL Ảnh chi tiết': (prod.detailImages || []).map(img => img.url).join(','),
            'Ngày tạo': prod.createdAt ? (typeof prod.createdAt.toDate === 'function' ? prod.createdAt.toDate().toISOString() : new Date(prod.createdAt).toISOString()) : '',
        };

        prod.attributes?.forEach(attr => {
            if (attr.label !== 'Danh mục / Phân loại') {
                row[attr.label] = attr.value;
            }
        });

        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Products");
    XLSX.writeFile(workbook, `san-pham-ansan-${new Date().getTime()}.xlsx`);
  };

  const renderFilterGroup = (
    title: string,
    groupKey: string,
    items: { label: string, category_id: string }[],
    filterState: any,
    handler: (group: any, tagId: string, checked: boolean) => void,
) => (
    <div key={groupKey}>
        <h4 className='font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-tight'>{title}</h4>
        <ScrollArea className="h-40 border rounded-md p-2 bg-background">
          <div className="flex flex-col gap-2 mt-1 pr-4">
              {items.map(item => (
                  <div key={item.category_id} className="flex items-center space-x-2">
                      <Checkbox
                          id={`${groupKey}-${item.category_id}`}
                          checked={filterState[groupKey]?.includes(item.category_id)}
                          onCheckedChange={(checked) => handler(groupKey, item.category_id, !!checked)}
                      />
                      <Label htmlFor={`${groupKey}-${item.category_id}`} className='font-normal cursor-pointer text-xs'>
                          {item.label}
                      </Label>
                  </div>
              ))}
          </div>
        </ScrollArea>
    </div>
);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-32" /></div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
        <div className="flex items-center flex-wrap justify-end gap-4">
            <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Xuất Excel ({filteredProducts.length})
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
                <FileUp className="mr-2 h-4 w-4" /> {isImporting ? 'Đang nhập...' : 'Nhập Excel'}
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls, .csv" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) { await importProducts(file); if (fileInputRef.current) fileInputRef.current.value = ''; }
            }} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Thêm sản phẩm mới</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {mainProductCategories.map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild>
                        <Link href={`/admin/products/new?categoryId=${cat.id}`}>{cat.name}</Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
        
      <Accordion type="single" collapsible className="my-4 bg-card p-4 rounded-md border shadow-sm">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className='flex items-center gap-2 text-base font-semibold'>
              <Filter className="h-4 w-4" />
              <span>Bộ lọc nâng cao ({filteredProducts.length} kết quả)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-6">
                     <h4 className='font-bold text-sm uppercase text-primary border-b pb-2'>Danh mục chính</h4>
                     <RadioGroup value={selectedCategoryId} onValueChange={setSelectedCategoryId} className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="cat-all" />
                            <Label htmlFor="cat-all" className="font-medium cursor-pointer">Tất cả</Label>
                        </div>
                        {mainProductCategories.map((cat) => (
                            <div key={cat.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={cat.id} id={`cat-${cat.id}`} />
                                <Label htmlFor={`cat-${cat.id}`} className="font-medium cursor-pointer">{cat.name}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <div className="md:col-span-3">
                  <div className='border-l md:pl-8'>
                      <h4 className='font-bold text-sm uppercase text-primary mb-4 border-b pb-2'>Chi tiết phân loại</h4>
                      <div className='grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6'>
                        {isWineCategorySelected && (
                            <>
                                {renderFilterGroup('Theo loại', 'theoLoai', wineMegaMenuData.theoLoai, wineFilters, handleWineFilterChange)}
                                {renderFilterGroup('Theo Quốc Gia', 'theoQuocGia', wineMegaMenuData.theoQuocGia, wineFilters, handleWineFilterChange)}
                                {renderFilterGroup('Theo vùng', 'theoVung', wineMegaMenuData.theoVung, wineFilters, handleWineFilterChange)}
                                {renderFilterGroup('Theo giống nho', 'theoGiongNho', wineMegaMenuData.theoGiongNho, wineFilters, handleWineFilterChange)}
                            </>
                        )}
                        {isSpiritCategorySelected && (
                            <>
                                {renderFilterGroup('Loại rượu', 'theoLoai', spiritsMegaMenuData.theoLoai, spiritFilters, handleSpiritFilterChange)}
                                {renderFilterGroup('Thương hiệu', 'thuongHieu', spiritsMegaMenuData.thuongHieu, spiritFilters, handleSpiritFilterChange)}
                            </>
                        )}
                        {isGlasswareCategorySelected && (
                            <>
                                {renderFilterGroup('Phale Riedel', 'lyPhaLeRiedel', glasswareMegaMenuData.lyPhaLeRiedel, glasswareFilters, handleGlasswareFilterChange)}
                                {renderFilterGroup('Ly Whisky', 'lyWhisky', glasswareMegaMenuData.lyWhisky, glasswareFilters, handleGlasswareFilterChange)}
                                {renderFilterGroup('Khác', 'khac', glasswareMegaMenuData.khac, glasswareFilters, handleGlasswareFilterChange)}
                            </>
                        )}
                        {isGiftSetCategorySelected && (
                            <>
                                {renderFilterGroup('Loại quà tặng', 'quaTang', giftSetMegaMenuData.quaTang, giftSetFilters, handleGiftSetFilterChange)}
                            </>
                        )}
                        {!isWineCategorySelected && !isSpiritCategorySelected && !isGlasswareCategorySelected && !isGiftSetCategorySelected && (
                            <p className="col-span-full text-muted-foreground text-sm italic">Vui lòng chọn danh mục chính để xem các tùy chọn lọc chi tiết.</p>
                        )}
                      </div>
                  </div>
                </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button type="button" variant="ghost" onClick={() => setSelectedCategoryId('all')} className="text-muted-foreground hover:text-foreground">Xóa tất cả bộ lọc</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DataTable columns={columns} data={filteredProducts} />
    </div>
  );
}
