
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Category } from '@/lib/types';
import React from 'react';
import { useCategories } from '@/hooks/use-categories';
import { wineMegaMenuData, spiritsMegaMenuData } from '@/lib/mega-menu-data';

type WineCardProps = {
  product: Product;
};

export default function WineCard({ product }: WineCardProps) {
  const { categories } = useCategories();

  const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getAttribute = React.useCallback((labels: string[]): string => {
    if (product.attributes) {
      for (const label of labels) {
        const found = product.attributes.find(a => a.label.toLowerCase().trim() === label.toLowerCase().trim());
        if (found && found.value && found.value.toLowerCase() !== 'n/a') return found.value;
      }
    }
    if (product.description) {
        for (const label of labels) {
            const regex = new RegExp(`(?:${label.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})\\s*:\\s*([^•\\n]+)`, 'i');
            const match = product.description.match(regex);
            if (match && match[1] && match[1].trim().toLowerCase() !== 'n/a') {
                 return match[1].trim().replace(/\.$/, '');
            }
        }
    }
    return 'N/A';
  }, [product.attributes, product.description]);

  const { isWine, isSpirit } = React.useMemo(() => {
    if (!product.tags || !categories) return { isWine: false, isSpirit: false };
    
    const getRootParentId = (catId: string): string | null => {
        const cat = categories.find(c => c.id === catId);
        if (!cat) return null;
        if (!cat.parentId) return cat.id;
        return getRootParentId(cat.parentId);
    };

    let wine = false;
    let spirit = false;

    for (const tagId of product.tags) {
        const rootId = getRootParentId(tagId);
        if (rootId === 'ruou-vang') wine = true;
        if (rootId === 'ruou-manh') spirit = true;
    }

    return { isWine: wine, isSpirit: spirit };
  }, [product.tags, categories]);

  const mainCategoryName = React.useMemo(() => {
    if (!product.tags || !categories) return 'N/A';
    const getRootParent = (catId: string): Category | undefined => {
        const cat = categories.find(c => c.id === catId);
        if (!cat) return undefined;
        if (!cat.parentId) return cat.id;
        return getRootParent(cat.parentId);
    };
    for (const tagId of product.tags) {
        const root = getRootParent(tagId);
        if (root) return root.name.toUpperCase();
    }
    return 'N/A';
  }, [product.tags, categories]);

  const loaiRuouValue = React.useMemo(() => {
    // Priority: Database classification (tags)
    if (product.tags && categories) {
        const allTypes = [
            ...wineMegaMenuData.theoLoai.map(item => item.category_id),
            ...spiritsMegaMenuData.theoLoai.map(item => item.category_id)
        ];
        const typeTag = product.tags.find(tagId => allTypes.includes(tagId));
        if (typeTag) {
            const cat = categories.find(c => c.id === typeTag);
            if (cat) return cat.name;
        }
    }

    // Fallback: Attributes or Description
    const attr = getAttribute(['loại rượu', 'loại', 'type']);
    return attr;
  }, [product.tags, categories, getAttribute]);

  const countryValue = React.useMemo(() => {
    // Priority: Database classification (tags)
    if (product.tags && categories) {
        const countries = wineMegaMenuData.theoQuocGia.map(item => item.category_id);
        const countryTag = product.tags.find(tagId => countries.includes(tagId));
        if (countryTag) {
            const cat = categories.find(c => c.id === countryTag);
            if (cat) return cat.name;
        }
    }

    // Fallback: Attributes or Description
    const countryVal = getAttribute(['quốc gia', 'country']);
    if (countryVal !== 'N/A') return countryVal;
    
    const originVal = getAttribute(['xuất xứ', 'origin']);
    if (originVal !== 'N/A') {
      const parts = originVal.split(',');
      return parts[parts.length - 1].trim();
    }
    return 'N/A';
  }, [product.tags, categories, getAttribute]);

  const giongNhoValue = React.useMemo(() => {
    // Priority: Database classification (tags)
    if (product.tags && categories) {
        const grapeIds = wineMegaMenuData.theoGiongNho.map(item => item.category_id);
        const matchingTags = product.tags.filter(tagId => grapeIds.includes(tagId));
        
        if (matchingTags.length > 0) {
            const names = matchingTags.map(tagId => {
                const cat = categories.find(c => c.id === tagId);
                return cat ? cat.name : null;
            }).filter(Boolean);
            
            if (names.length > 0) return names.join(', ');
        }
    }

    // Fallback: Attributes or Description
    return getAttribute(['giống nho', 'nho', 'grapes']);
  }, [product.tags, categories, getAttribute]);

  const nồngĐộValue = getAttribute(['nồng độ cồn', 'nồng độ', 'alc', 'abv']);

  const salePrice = Number(product.price);
  const originalPrice = product.secondaryPrice ? Number(product.secondaryPrice) : null;
  const hasDiscount = originalPrice !== null && isFinite(originalPrice) && isFinite(salePrice) && originalPrice > salePrice;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice! - salePrice!) / originalPrice!) * 100) : 0;

  return (
    <div className="group text-left bg-white rounded-lg p-2 transition-shadow hover:shadow-md h-full flex flex-col">
      <Link href={`/san-pham/${product.slug}`} className="block flex-grow">
        <div className="relative overflow-hidden group/image rounded-md aspect-square bg-gray-50 flex items-center justify-center p-4">
            {product.isGoodPrice || hasDiscount ? (
                 <div className="absolute top-2 left-2 z-10 rounded-sm bg-red-700 px-2 py-1 text-[10px] font-bold uppercase text-white animate-flash">
                    Giá Đặc biệt
                </div>
            ) : product.bestChoice && (
                <div className="absolute top-2 left-2 z-10 rounded-sm bg-red-700 px-2 py-1 text-[10px] font-bold uppercase text-white">
                    Best Choice
                </div>
            )}
            {hasDiscount && (
                <div className="absolute top-2 right-2 z-10 rounded-sm bg-red-700 px-2 py-1 text-[10px] font-bold text-white">
                    -{discountPercentage}%
                </div>
            )}
            <Image
                src={product.image?.url || '/placeholder.svg'}
                alt={product.nameVN}
                width={300}
                height={300}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
        </div>
        
        <div className="mt-4 px-1 space-y-2">
            {mainCategoryName !== 'N/A' && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{mainCategoryName}</p>
            )}
            
            <h3 className="font-headline text-base font-bold uppercase text-[#8a7d6a] line-clamp-2 min-h-[3rem] transition-colors group-hover:text-primary">
                {product.nameVN}
            </h3>

            <div className="flex items-baseline gap-2 flex-wrap">
                {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice!)}</span>
                )}
                <span className="text-lg font-bold text-red-700">{formatPrice(salePrice)}</span>
            </div>

            {(isWine || isSpirit) && (
                <div className="grid grid-cols-2 gap-x-2 gap-y-3 pt-2 border-t border-gray-100">
                    {countryValue !== 'N/A' && (
                        <div className="flex items-start gap-1.5">
                            <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/Qu%E1%BB%91c_gia_aoyqrn.png" alt="Quốc gia" width={16} height={16} className="shrink-0 mt-0.5" />
                            <span className="text-[11px] text-gray-600 truncate" title={countryValue}>{countryValue}</span>
                        </div>
                    )}
                    {loaiRuouValue !== 'N/A' && (
                        <div className="flex items-start gap-1.5">
                            <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180057/Lo%E1%BA%A1i_r%C6%B0%E1%BB%A3u_ma76dk.png" alt="Loại rượu" width={16} height={16} className="shrink-0 mt-0.5" />
                            <span className="text-[11px] text-gray-600 truncate" title={loaiRuouValue}>{loaiRuouValue}</span>
                        </div>
                    )}
                    {giongNhoValue !== 'N/A' && (
                        <div className="flex items-start gap-1.5">
                            <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/Gi%E1%BB%91ng_nho_bkeprd.png" alt="Giống nho" width={16} height={16} className="shrink-0 mt-0.5" />
                            <span className="text-[11px] text-gray-600 truncate" title={giongNhoValue}>{giongNhoValue}</span>
                        </div>
                    )}
                    {nồngĐộValue !== 'N/A' && (
                        <div className="flex items-start gap-1.5">
                            <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/T%E1%BB%B7_l%E1%BB%87_jal6sg.png" alt="Nồng độ" width={16} height={16} className="shrink-0 mt-0.5" />
                            <span className="text-[11px] text-gray-600 truncate" title={nồngĐộValue}>{nồngĐộValue}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
      </Link>
    </div>
  );
}
