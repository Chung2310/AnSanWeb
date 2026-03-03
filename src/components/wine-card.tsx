'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Category } from '@/lib/types';
import React from 'react';
import { wineMegaMenuData } from '@/lib/mega-menu-data';

type WineCardProps = {
  product: Product;
  categories: Category[] | null;
};

export default function WineCard({ product, categories }: WineCardProps) {
  const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const categoryMap = React.useMemo(() => {
    if (!categories) return new Map<string, Category>();
    return new Map(categories.map(c => [c.id, c]));
  }, [categories]);

  const getAttribute = React.useCallback((labels: string[]): string => {
    if (product.attributes) {
      for (const label of labels) {
        const normalizedLabel = label.toLowerCase().trim();
        const found = product.attributes.find(a => a.label?.toLowerCase().trim() === normalizedLabel);
        if (found && found.value && found.value.toLowerCase() !== 'n/a') return found.value;
      }
    }
    
    // Fallback search in description if attributes fail
    if (product.description) {
        const text = product.description.toLowerCase();
        for (const label of labels) {
            const index = text.indexOf(label.toLowerCase());
            if (index !== -1) {
                const afterLabel = product.description.substring(index + label.length).trim();
                const match = afterLabel.match(/^[:\s]*([^•\n]+)/);
                if (match && match[1] && match[1].trim().toLowerCase() !== 'n/a') {
                    return match[1].trim().replace(/\.$/, '');
                }
            }
        }
    }
    return 'Đang cập nhật';
  }, [product.attributes, product.description]);

  const { isWine, isSpirit, mainCategoryName } = React.useMemo(() => {
    if (!product.tags || !categories || categories.length === 0) {
        return { isWine: false, isSpirit: false, mainCategoryName: '' };
    }
    
    const getRootParent = (catId: string): Category | null => {
        const cat = categoryMap.get(catId);
        if (!cat) return null;
        if (!cat.parentId) return cat;
        return getRootParent(cat.parentId);
    };

    let wine = false;
    let spirit = false;
    let mName = '';

    for (const tagId of product.tags) {
        const root = getRootParent(tagId);
        if (root) {
            if (root.id === 'ruou-vang' || root.slug === 'ruou-vang') wine = true;
            if (root.id === 'ruou-manh' || root.slug === 'ruou-manh') spirit = true;
            if (root.name) mName = root.name.toUpperCase();
        }
    }

    return { isWine: wine, isSpirit: spirit, mainCategoryName: mName };
  }, [product.tags, categories, categoryMap]);

  const countryValue = React.useMemo(() => {
    if (product.tags && categories) {
        const countryIds = wineMegaMenuData.theoQuocGia.map(item => item.category_id);
        const countryTag = product.tags.find(tagId => countryIds.includes(tagId));
        if (countryTag) {
            const cat = categoryMap.get(countryTag);
            if (cat) return cat.name;
        }
    }
    const val = getAttribute(['quốc gia', 'country', 'xuất xứ', 'vùng']);
    return val !== 'Đang cập nhật' ? val : 'Đang cập nhật';
  }, [product.tags, categories, categoryMap, getAttribute]);

  const giongNhoValue = React.useMemo(() => {
    if (product.tags && categories) {
        const grapeIds = wineMegaMenuData.theoGiongNho.map(item => item.category_id);
        const matchingTags = product.tags.filter(tagId => grapeIds.includes(tagId));
        if (matchingTags.length > 0) {
            const names = matchingTags.map(tagId => {
                const cat = categoryMap.get(tagId);
                return cat ? cat.name : null;
            }).filter(Boolean);
            if (names.length > 0) return names.join(', ');
        }
    }
    return getAttribute(['giống nho', 'nho', 'grapes']);
  }, [product.tags, categories, categoryMap, getAttribute]);

  const alcoholContent = React.useMemo(() => 
    getAttribute(['nồng độ cồn', 'nồng độ', 'alc', 'abv'])
  , [getAttribute]);

  const capacityValue = React.useMemo(() => {
    const attr = getAttribute(['dung tích', 'thể tích', 'volume']);
    if (attr === 'Đang cập nhật' && isWine) return '750ml';
    return attr;
  }, [isWine, getAttribute]);

  const salePrice = Number(product.price);
  const originalPrice = product.secondaryPrice ? Number(product.secondaryPrice) : null;
  const hasDiscount = originalPrice !== null && isFinite(originalPrice) && isFinite(salePrice) && originalPrice > salePrice;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice! - salePrice!) / originalPrice!) * 100) : 0;

  return (
    <div className="group text-left bg-white rounded-lg p-2 transition-shadow hover:shadow-md h-full flex flex-col">
      <Link href={`/san-pham/${product.slug}`} className="block flex-grow">
        <div className="relative overflow-hidden group/image rounded-md aspect-square bg-gray-50 flex items-center justify-center p-4">
            {(product.isGoodPrice || hasDiscount) ? (
                 <div className="absolute top-2 left-2 z-10 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase text-white animate-flash">
                    Giá Đặc biệt
                </div>
            ) : product.bestChoice && (
                <div className="absolute top-2 left-2 z-10 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase text-white">
                    Best Choice
                </div>
            )}
            {hasDiscount && (
                <div className="absolute top-2 right-2 z-10 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold text-white">
                    -{discountPercentage}%
                </div>
            )}
            <div className="relative w-full h-full">
                <Image
                    src={product.image?.url || 'https://picsum.photos/seed/wine/400/400'}
                    alt={product.nameVN}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    quality={60}
                    loading="lazy"
                />
            </div>
        </div>
        
        <div className="mt-4 px-1 space-y-2">
            {mainCategoryName && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{mainCategoryName}</p>
            )}
            
            <h3 className="font-montserrat text-sm md:text-base font-bold uppercase text-[#600e1c] line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] transition-colors group-hover:opacity-80">
                {product.nameVN}
            </h3>

            <div className="flex items-baseline gap-2 flex-wrap">
                {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice!)}</span>
                )}
                <span className="text-base md:text-lg font-bold text-primary">{formatPrice(salePrice)}</span>
            </div>

            {(isWine || isSpirit) && (
                <div className="grid grid-cols-2 gap-x-2 gap-y-3 pt-2 border-t border-gray-100">
                    <div className="flex items-start gap-1.5">
                        <div className="relative w-4 h-4 shrink-0 mt-0.5">
                            <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/Qu%E1%BB%91c_gia_aoyqrn.png" alt="Quốc gia" fill className="object-contain" />
                        </div>
                        <span className="text-[10px] md:text-[11px] text-gray-600 leading-tight line-clamp-1" title={countryValue}>
                            {countryValue}
                        </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                        <div className="relative w-4 h-4 shrink-0 mt-0.5">
                            <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/T%E1%BB%B7_l%E1%BB%87_jal6sg.png" alt="Nồng độ" fill className="object-contain" />
                        </div>
                        <span className="text-[10px] md:text-[11px] text-gray-600 leading-tight line-clamp-1" title={alcoholContent}>
                            {alcoholContent}
                        </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                        <div className="relative w-4 h-4 shrink-0 mt-0.5">
                            <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/Xu%E1%BA%A5t_x%E1%BB%A9_v8sysc.png" alt="Dung tích" fill className="object-contain" />
                        </div>
                        <span className="text-[10px] md:text-[11px] text-gray-600 leading-tight line-clamp-1" title={capacityValue}>
                            {capacityValue}
                        </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                        <div className="relative w-4 h-4 shrink-0 mt-0.5">
                            <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/Gi%E1%BB%91ng_nho_bkeprd.png" alt="Giống nho" fill className="object-contain" />
                        </div>
                        <span className="text-[10px] md:text-[11px] text-gray-600 leading-tight line-clamp-1" title={giongNhoValue}>
                            {giongNhoValue}
                        </span>
                    </div>
                </div>
            )}
        </div>
      </Link>
    </div>
  );
}
