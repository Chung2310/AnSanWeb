'use client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, Download, FileUp } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/hooks/use-products';
import { DataTable } from '@/components/admin/products/data-table';
import { columns } from '@/components/admin/products/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Category, FullProduct } from '@/lib/types';
import * as XLSX from 'xlsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { wineMegaMenuData, spiritsMegaMenuData } from '@/lib/mega-menu-data';
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

// Define filter types
type WineFilters = {
  theoLoai: string[];
  theoQuocGia: string[];
  theoVung: string[];
  theoGiongNho: string[];
};

type SpiritFilters = {
  thuongHieu: string[];
};


export default function ProductsAdminPage() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const { importProducts, isImporting } = useImportProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [wineFilters, setWineFilters] = useState<WineFilters>({
    theoLoai: [],
    theoQuocGia: [],
    theoVung: [],
    theoGiongNho: [],
  });

  const [spiritFilters, setSpiritFilters] = useState<SpiritFilters>({
    thuongHieu: [],
  });

  const mainProductCategories = useMemo(() => {
    if (!categories) return [];
    const slugs = ['ruou-vang', 'ruou-manh', 'ly-coc-pha-le', 'bo-qua-tang', 'cigar'];
    return slugs.map(slug => categories.find(c => c.slug === slug)).filter((c): c is Category => !!c);
  }, [categories]);

  const wineCategory = useMemo(() => {
    if (!categories) return null;
    return categories.find(c => c.slug === 'ruou-vang');
  }, [categories]);
  
  const spiritCategory = useMemo(() => {
    if (!categories) return null;
    return categories.find(c => c.slug === 'ruou-manh');
  }, [categories]);

  const isWineCategorySelected = selectedCategoryId === wineCategory?.id;
  const isSpiritCategorySelected = selectedCategoryId === spiritCategory?.id;

  useEffect(() => {
    if (!isWineCategorySelected) {
        setWineFilters({ theoLoai: [], theoQuocGia: [], theoVung: [], theoGiongNho: [] });
    }
    if (!isSpiritCategorySelected) {
        setSpiritFilters({ thuongHieu: [] });
    }
  }, [selectedCategoryId, isWineCategorySelected, isSpiritCategorySelected]);


  const getDescendantIds = useCallback((parentId: string, allCategories: Category[]): string[] => {
    const descendantIds: string[] = [];
    const queue: string[] = [parentId];
    const visited: Set<string> = new Set();
    
    const parentCategory = allCategories.find(cat => cat.id === parentId);
    if(parentCategory) {
       visited.add(parentCategory.id);
       if(parentCategory.slug) {
         visited.add(parentCategory.slug);
       }
    }

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      const children = allCategories.filter(cat => cat.parentId === currentId);
      for (const child of children) {
        if (!visited.has(child.id)) {
          descendantIds.push(child.id);
          if (child.slug) {
            descendantIds.push(child.slug);
          }
          queue.push(child.id);
          visited.add(child.id);
        }
      }
    }
    return descendantIds;
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products || !categories) {
      return [];
    }
    
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

    // 2. If wine category is selected, apply detailed wine filters
    if (isWineCategorySelected) {
      const { theoLoai, theoQuocGia, theoVung, theoGiongNho } = wineFilters;
      const hasActiveFilter = theoLoai.length > 0 || theoQuocGia.length > 0 || theoVung.length > 0 || theoGiongNho.length > 0;

      if (hasActiveFilter) {
          tempProducts = tempProducts.filter(p => {
              const productTags = new Set(p.tags || []);
              const matchLoai = theoLoai.length === 0 || theoLoai.some(tag => productTags.has(tag));
              const matchQuocGia = theoQuocGia.length === 0 || theoQuocGia.some(tag => productTags.has(tag));
              const matchVung = theoVung.length === 0 || theoVung.some(tag => productTags.has(tag));
              const matchGiongNho = theoGiongNho.length === 0 || theoGiongNho.some(tag => productTags.has(tag));
              return matchLoai && matchQuocGia && matchVung && matchGiongNho;
          });
      }
    }

    // 3. If spirit category is selected, apply detailed spirit filters
    if (isSpiritCategorySelected) {
        const { thuongHieu } = spiritFilters;
        if (thuongHieu.length > 0) {
             tempProducts = tempProducts.filter(p => {
                const productTags = new Set(p.tags || []);
                return thuongHieu.some(tag => productTags.has(tag));
            });
        }
    }
    
    return tempProducts;

  }, [products, categories, selectedCategoryId, getDescendantIds, isWineCategorySelected, wineFilters, isSpiritCategorySelected, spiritFilters]);

  const isLoading = isLoadingProducts || isLoadingCategories;
  
  const handleExport = () => {
    if (!filteredProducts || filteredProducts.length === 0) {
      alert("Không có dữ liệu để xuất.");
      return;
    }
  
    const categoryMap = new Map(categories?.map(c => [c.id, c.name]));
    
    const wineTagToGroupMap = new Map<string, string>();
    const wineTagToLabelMap = new Map<string, string>();
    for (const [groupKey, items] of Object.entries(wineMegaMenuData)) {
      for (const item of items) {
        wineTagToGroupMap.set(item.category_id, groupKey);
        wineTagToLabelMap.set(item.category_id, item.label);
      }
    }
  
    const wineCategory = categories?.find(c => c.slug === 'ruou-vang');
    const wineCategoryAndDescendantIds = new Set<string>();
    if (wineCategory && categories) {
      const descendantIds = getDescendantIds(wineCategory.id, categories);
      wineCategoryAndDescendantIds.add(wineCategory.id);
      descendantIds.forEach(id => wineCategoryAndDescendantIds.add(id));
    }
  
    const allAttributeLabels = [...new Set(
      filteredProducts.flatMap(p => p.attributes ? p.attributes.map(a => a.label) : [])
    )];
  
    const dataToExport = filteredProducts.map(product => {
      const isWineProduct = product.tags?.some(tag => wineCategoryAndDescendantIds.has(tag));
      
      const generalCategories: string[] = [];
      const wineClassification = {
        theoLoai: [] as string[],
        theoQuocGia: [] as string[],
        theoVung: [] as string[],
        theoGiongNho: [] as string[],
      };
  
      product.tags?.forEach(tagId => {
        if (isWineProduct && wineTagToGroupMap.has(tagId)) {
          const group = wineTagToGroupMap.get(tagId) as keyof typeof wineClassification;
          const label = wineTagToLabelMap.get(tagId);
          if (group && label) {
            wineClassification[group].push(label);
          }
        } else if (categoryMap.has(tagId)) {
          generalCategories.push(categoryMap.get(tagId)!);
        }
      });
  
      const row: { [key: string]: any } = {
        'ID': product.id,
        'Tên sản phẩm': product.nameVN,
        'Đường dẫn (slug)': product.slug,
        'Giá': product.price,
        'Mô tả giá': product.priceDescription,
        'Giá phụ': product.secondaryPrice,
        'Mô tả giá phụ': product.secondaryPriceDescription,
        'Trạng thái': product.status === 'published' ? 'Đã xuất bản' : 'Bản nháp',
        'Nổi bật': product.isFeatured ? 'Có' : 'Không',
        'Sản phẩm mới': product.isNew ? 'Có' : 'Không',
        'Lựa chọn tốt nhất': product.bestChoice ? 'Có' : 'Không',
        'Danh mục chung': generalCategories.join(', '),
        'Loại rượu': isWineProduct ? wineClassification.theoLoai.join(', ') : '',
        'Quốc gia': isWineProduct ? wineClassification.theoQuocGia.join(', ') : '',
        'Vùng': isWineProduct ? wineClassification.theoVung.join(', ') : '',
        'Giống nho': isWineProduct ? wineClassification.theoGiongNho.join(', ') : '',
        'Mô tả ngắn': product.shortDescription,
        'URL Ảnh bìa': product.image?.url,
        'URL Ảnh chi tiết': product.detailImages?.map(img => img.url).join(', \n'),
        'Ngày tạo': product.createdAt?.toDate ? product.createdAt.toDate().toISOString() : '',
      };
  
      allAttributeLabels.forEach(label => {
        const attr = product.attributes?.find(a => a.label === label);
        row[label] = attr ? attr.value : '';
      });
  
      return row;
    });
      
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sản phẩm");
    XLSX.writeFile(workbook, "danh-sach-san-pham.xlsx");
  };

  const handleWineFilterChange = (group: keyof WineFilters, tagId: string, checked: boolean) => {
    setWineFilters(prev => {
        const currentGroup = prev[group];
        const newGroup = checked 
            ? [...currentGroup, tagId] 
            : currentGroup.filter(item => item !== tagId);
        return { ...prev, [group]: newGroup };
    });
  };

  const clearWineFilters = () => {
      setWineFilters({ theoLoai: [], theoQuocGia: [], theoVung: [], theoGiongNho: [] });
  }

  const handleSpiritFilterChange = (group: keyof SpiritFilters, tagId: string, checked: boolean) => {
    setSpiritFilters(prev => {
        const currentGroup = prev[group];
        const newGroup = checked 
            ? [...currentGroup, tagId] 
            : currentGroup.filter(item => item !== tagId);
        return { ...prev, [group]: newGroup };
    });
  };
    
  const clearSpiritFilters = () => {
      setSpiritFilters({ thuongHieu: [] });
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await importProducts(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderFilterGroup = (
    title: string,
    groupKey: keyof WineFilters | keyof SpiritFilters,
    items: { label: string, category_id: string }[],
    filterState: WineFilters | SpiritFilters,
    handler: (group: any, tagId: string, checked: boolean) => void,
) => (
    <div>
        <h4 className='font-semibold mb-2 text-base'>{title}</h4>
        <ScrollArea className="h-40">
          <div className="flex flex-col gap-2 mt-2 pr-4">
              {items.map(item => (
                  <div key={item.category_id} className="flex items-center space-x-2">
                      <Checkbox
                          id={`${groupKey}-${item.category_id}`}
                          checked={(filterState[groupKey as keyof typeof filterState] as string[]).includes(item.category_id)}
                          onCheckedChange={(checked) => handler(groupKey, item.category_id, !!checked)}
                      />
                      <Label htmlFor={`${groupKey}-${item.category_id}`} className='font-normal cursor-pointer'>
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
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <div className="flex items-center flex-wrap justify-end gap-4">
            <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
            >
                <FileUp className="mr-2 h-4 w-4" />
                {isImporting ? 'Đang nhập...' : 'Nhập Excel'}
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileSelect}
            />

            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Thêm sản phẩm mới
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {mainProductCategories.map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild>
                        <Link href={`/admin/products/new?categoryId=${cat.id}`}>
                            {cat.name}
                        </Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
        
      <Accordion type="single" collapsible className="my-4 bg-card p-4 rounded-md border">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger>
            <div className='flex items-center gap-2 text-base font-semibold'>
              <Filter className="h-4 w-4" />
              <span>Lọc sản phẩm ({filteredProducts.length} / {products?.length || 0} kết quả)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-6">
                     <h4 className='font-semibold text-base border-b pb-2'>Danh mục chính</h4>
                     <RadioGroup value={selectedCategoryId} onValueChange={setSelectedCategoryId} className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="cat-all" />
                            <Label htmlFor="cat-all" className="font-normal cursor-pointer">Tất cả danh mục</Label>
                        </div>
                        {mainProductCategories.map((cat) => (
                            <div key={cat.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={cat.id} id={`cat-${cat.id}`} />
                                <Label htmlFor={`cat-${cat.id}`} className="font-normal cursor-pointer">{cat.name}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <div className="md:col-span-3">
                  {isWineCategorySelected && (
                      <div className='border-l md:pl-6'>
                          <h4 className='font-semibold mb-4 text-base border-b pb-2'>Chi tiết Rượu Vang</h4>
                          <div className='grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4'>
                            {renderFilterGroup('Theo loại rượu', 'theoLoai', wineMegaMenuData.theoLoai, wineFilters, handleWineFilterChange)}
                            {renderFilterGroup('Theo Quốc Gia', 'theoQuocGia', wineMegaMenuData.theoQuocGia, wineFilters, handleWineFilterChange)}
                            {renderFilterGroup('Theo vùng', 'theoVung', wineMegaMenuData.theoVung, wineFilters, handleWineFilterChange)}
                            {renderFilterGroup('Theo giống nho', 'theoGiongNho', wineMegaMenuData.theoGiongNho, wineFilters, handleWineFilterChange)}
                          </div>
                      </div>
                  )}

                  {isSpiritCategorySelected && (
                     <div className='border-l md:pl-6'>
                          <h4 className='font-semibold mb-4 text-base border-b pb-2'>Chi tiết Rượu Mạnh</h4>
                          <div className='grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4'>
                             {renderFilterGroup('Thương hiệu', 'thuongHieu', spiritsMegaMenuData.thuongHieu, spiritFilters, handleSpiritFilterChange)}
                          </div>
                      </div>
                  )}
                </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="button" variant="secondary" onClick={() => {
                clearWineFilters();
                clearSpiritFilters();
                setSelectedCategoryId('all');
              }}>Xóa bộ lọc</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DataTable columns={columns} data={filteredProducts || []} />
    </div>
  );
}
