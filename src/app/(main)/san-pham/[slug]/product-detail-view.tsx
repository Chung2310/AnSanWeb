
'use client';

import React from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { Separator } from '@/components/ui/separator';
import type { ProductStructuredDetails, FullProduct, ImageInfo } from '@/lib/types';
import ProductInfoSection from '@/components/product-info-section';
import FaqSection from '@/components/faq-section';
import ProductDetailDescription from '@/components/product-detail-description';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Award, CircleDollarSign, Users, Truck, GlassWater, Phone, MessageCircle, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { wineMegaMenuData } from '@/lib/mega-menu-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

const CompensationIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.75 14.25H11.25C10.4216 14.25 9.75 13.5784 9.75 12.75V12.75C9.75 11.9216 10.4216 11.25 11.25 11.25H12C12.8284 11.25 13.5 10.5784 13.5 9.75V9.75C13.5 8.92157 12.8284 8.25 12 8.25H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const generateProductDetails = (product: FullProduct): ProductStructuredDetails => {
    const extractFromDescription = (description: string | undefined, ...keywords: string[]): string | undefined => {
        if (!description) return undefined;
        
        // Clean HTML: replace block tags with newlines first, then strip remaining tags
        // Do NOT use .replace(/\s+/g, ' ') here as it collapses the newlines we need for stopping the regex
        const cleanText = description
            .replace(/<\/p>|<\/div>|<br\s*\/?>/gi, '\n')
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/g, ' ');

        for (const keyword of keywords) {
            const regex = new RegExp(`(?:${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})\\s*[:\\-]?\\s*([^•\\n\\r]+)`, 'i');
            const match = cleanText.match(regex);
            if (match && match[1]) {
                const val = match[1].trim().replace(/\.$/, '').trim();
                // Heuristic: if extracted text is too long, it probably didn't find a natural stop
                // Tasting notes are usually short sentences or fragments
                if (val.length > 0 && val.length < 250) {
                    return val;
                }
            }
        }
        return undefined;
    };
    
    const findAttr = (labels: string[]) => {
      if (product.attributes) {
        for (const label of labels) {
          const found = product.attributes.find(a => a.label?.toLowerCase().trim() === label.toLowerCase().trim());
          if (found && found.value && found.value.toLowerCase() !== 'n/a') return found.value;
        }
      }
      return extractFromDescription(product.description, ...labels);
    };
    
    const paragraphs = product.description ? [product.description] : [];

    const details: ProductStructuredDetails = {
        title: product.nameVN,
        paragraphs: paragraphs,
        details: product.attributes || [],
        brand: findAttr(["thương hiệu", "brand"]),
        chillFiltered: findAttr(["lọc lạnh", "chill filtered"]),
        region: findAttr(["vùng sản xuất", 'xuất xứ', 'vùng', 'origin']),
        caskType: findAttr(["loại thùng", "cask type"]),
        tastingNote: {
            nose: extractFromDescription(product.description, 'Hương thơm', 'Mùi hương', 'Nose'),
            palate: extractFromDescription(product.description, 'Vị giác', 'Vị', 'Hương vị thưởng thức', 'Palate'),
            finish: extractFromDescription(product.description, 'Hậu vị', 'Kết thúc', 'Finish'),
            color: extractFromDescription(product.description, 'Màu sắc', 'của vang', 'Color'),
        },
        conclusion: extractFromDescription(product.description, "kết luận", "Conclusion"),
        howToEnjoy: extractFromDescription(product.description, "cách thưởng thức", "Thưởng thức", "How to enjoy"),
        foodPairing: extractFromDescription(product.description, "kết hợp món ăn", "Food pairing"),
        storage: extractFromDescription(product.description, "bảo quản", "Storage")
    };

    return details;
}

const InfoItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="relative w-8 h-8 shrink-0 mt-0.5">
      <Image src={icon} alt={label} fill className="object-contain" />
    </div>
    <div className="flex flex-col overflow-hidden">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none mb-1">{label}</span>
      <span className="font-bold text-sm leading-tight text-gray-800 break-words">{value}</span>
    </div>
  </div>
);

export default function ProductDetailView({ product }: { product: FullProduct }) {
  const { categories } = useCategories();
  const details = React.useMemo(() => generateProductDetails(product), [product]);
  const allImages = React.useMemo(() => {
    const images: ImageInfo[] = [];
    if (product.image) images.push(product.image);
    if (product.detailImages) images.push(...product.detailImages);
    return images;
  }, [product]);

  const getAttribute = React.useCallback((labels: string[]): string => {
    if (product.attributes) {
      for (const label of labels) {
        const found = product.attributes.find(a => a.label?.toLowerCase().trim() === label.toLowerCase().trim());
        if (found && found.value && found.value.toLowerCase() !== 'n/a' && found.value !== 'Đang cập nhật') return found.value;
      }
    }
    if (product.description) {
        // Clean HTML for extraction
        const cleanText = product.description
            .replace(/<\/p>|<\/div>|<br\s*\/?>/gi, '\n')
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/g, ' ');

        for (const label of labels) {
            const regex = new RegExp(`(?:${label.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})\\s*[:\\-]?\\s*([^•\\n\\r]+)`, 'i');
            const match = cleanText.match(regex);
            if (match && match[1] && match[1].trim().toLowerCase() !== 'n/a') {
                 const val = match[1].trim().replace(/\.$/, '');
                 if (val.length < 150) return val;
            }
        }
    }
    return 'N/A';
  }, [product.attributes, product.description]);

  const { isWine, isSpirit } = React.useMemo(() => {
    if (!product.tags || !categories) return { isWine: false, isSpirit: false };
    
    const getRootParentId = (catId: string): string | null => {
        const cat = categories.find(c => c.id === catId || c.slug === catId);
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

  const countryValue = React.useMemo(() => {
    if (product.tags && categories) {
        const countries = wineMegaMenuData.theoQuocGia.map(item => item.category_id);
        const countryTag = product.tags.find(tagId => countries.includes(tagId));
        if (countryTag) {
            const cat = categories.find(c => c.id === countryTag);
            if (cat) return cat.name;
        }
    }
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
    return getAttribute(['giống nho', 'nho', 'grapes']);
  }, [product.tags, categories, getAttribute]);

  const capacityValue = React.useMemo(() => {
    if (!isWine && !isSpirit) return null;
    const attr = getAttribute(['dung tích', 'thể tích', 'volume']);
    if (attr === 'N/A' && isWine) return '750ml';
    return attr;
  }, [isWine, isSpirit, getAttribute]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const breadcrumbs = React.useMemo(() => {
    const paths = [{ label: 'TRANG CHỦ', href: '/' }];
    if (!product.tags || !categories) return paths;

    const getPath = (categoryId: string): { label: string; href: string }[] => {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return [];
      const parentPath = category.parentId ? getPath(category.parentId) : [];
      return [...parentPath, { label: (category.name || '').toUpperCase(), href: `/danh-muc/${category.slug}` }];
    };

    const primaryTag = product.tags[0];
    if (primaryTag) {
      const categoryInfo = categories.find(c => c.id === primaryTag);
      if (categoryInfo) {
        paths.push(...getPath(categoryInfo.id));
      }
    }
    
    return paths;
  }, [product.tags, categories]);

  const isBestChoice = React.useMemo(() => {
    const bestChoiceProductNames = [
      "Old Vine Cabernet Sauvignon",
      "Old Vine Shiraz",
      "Gigino Grande (Phiên bản kỷ niệm 80 năm) – Vang Đỏ",
      "Sgarzi Luigi Primitivo di Manduria DOC",
      "Piandimare \"Tassanera\" Montepulciano d'Abruzzo Riserva",
      "Enzo Vincenzo Appassimento Puglia IGT",
      "Grande Alberone Moscato",
    ].map(name => name.replace(/\u200B/g, '').trim());

    const productName = product.nameVN.replace(/\u200B/g, '').trim();
    return bestChoiceProductNames.includes(productName);
  }, [product.nameVN]);

  const salePrice = Number(product.price);
  const originalPrice = product.secondaryPrice ? Number(product.secondaryPrice) : null;

  const hasDiscount = originalPrice !== null && isFinite(originalPrice) && isFinite(salePrice) && originalPrice > salePrice;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice! - salePrice!) / originalPrice!) * 100) : 0;

  return (
    <>
      <div className="bg-white text-black">
        <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 max-w-screen-xl mx-auto">
                {/* Image Section - Column 5/12 */}
                <div className="lg:col-span-5">
                    <div className="space-y-4">
                        {allImages.map((image, index) => (
                        <Dialog key={index}>
                            <DialogTrigger asChild>
                                <div className="rounded-lg bg-white p-4 flex items-center justify-center relative border border-gray-50 shadow-sm cursor-zoom-in group">
                                    {index === 0 && (
                                        <>
                                            {hasDiscount ? (
                                                <div className="absolute top-4 left-4 z-10 flex items-center rounded-sm bg-destructive px-4 py-2 text-sm font-bold uppercase text-destructive-foreground shadow-md animate-flash">
                                                    <span>Giá Đặc Biệt</span>
                                                </div>
                                            ) : isBestChoice && (
                                                <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-bold uppercase px-3 py-1 rounded-full shadow-md z-10">
                                                    Best Choice
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <Image
                                      src={image.url}
                                      alt={`${product.nameVN} - ảnh ${index + 1}`}
                                      width={800}
                                      height={800}
                                      className="w-full h-auto max-h-[600px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                                      priority={index === 0}
                                    />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Phóng to ảnh sản phẩm</DialogTitle>
                                </DialogHeader>
                                <DialogClose asChild>
                                    <div className="relative w-full h-full flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-lg p-2 cursor-zoom-out">
                                        <Image
                                            src={image.url}
                                            alt={`${product.nameVN} - ảnh ${index + 1}`}
                                            width={1200}
                                            height={1200}
                                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                        />
                                    </div>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                        ))}
                    </div>
                </div>

                {/* Info Section - Column 7/12 */}
                <div className="lg:col-span-7 row-start-1 lg:row-start-auto">
                    <div className="md:sticky md:top-24 space-y-6">
                        <Breadcrumb className="text-xs">
                            <BreadcrumbList>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={crumb.href}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                    <Link href={crumb.href}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {index < breadcrumbs.length && index !== breadcrumbs.length -1 && <BreadcrumbSeparator />}
                                </React.Fragment>
                            ))}
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="line-clamp-1">{product.nameVN.toUpperCase()}</BreadcrumbPage>
                            </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        
                        <h1 className="font-headline text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                            {product.nameVN}
                        </h1>

                        {product.shortDescription && (
                          <p className="text-base text-muted-foreground">{product.shortDescription}</p>
                        )}

                        {(isWine || isSpirit) && (
                          <>
                            <Separator className="opacity-50" />
                            {/* Main Info Grid - strictly 4 icons: Quốc gia, Nồng độ, Dung tích, Giống nho (2x2 layout) */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <InfoItem 
                                    icon="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/Qu%E1%BB%91c_gia_aoyqrn.png"
                                    label="QUỐC GIA"
                                    value={countryValue !== 'N/A' ? countryValue : 'N/A'}
                                />
                                <InfoItem 
                                    icon="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/T%E1%BB%B7_l%E1%BB%87_jal6sg.png"
                                    label="NỒNG ĐỘ"
                                    value={getAttribute(['nồng độ cồn', 'nồng độ', 'alc', 'abv']) !== 'N/A' ? getAttribute(['nồng độ cồn', 'nồng độ', 'alc', 'abv']) : 'N/A'}
                                />
                                <InfoItem 
                                    icon="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/Xu%E1%BA%A5t_x%E1%BB%A9_v8sysc.png"
                                    label="DUNG TÍCH"
                                    value={capacityValue && capacityValue !== 'N/A' ? capacityValue : 'N/A'}
                                />
                                <InfoItem 
                                    icon="https://res.cloudinary.com/dxukxjf6w/image/upload/v1772180058/Gi%E1%BB%91ng_nho_bkeprd.png"
                                    label="GIỐNG NHO"
                                    value={giongNhoValue !== 'N/A' ? giongNhoValue : 'N/A'}
                                />
                            </div>
                          </>
                        )}

                        <Separator className="opacity-50" />
                        
                        {hasDiscount ? (
                            <div className="flex items-baseline gap-4">
                                <span className="text-xl text-muted-foreground line-through">{formatPrice(originalPrice!)}</span>
                                <span className="text-3xl font-bold text-destructive">{formatPrice(salePrice)}</span>
                                <div className="rounded-sm bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                                    -{discountPercentage}%
                                </div>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-primary">
                                {formatPrice(salePrice)}
                            </p>
                        )}

                        <Separator className="opacity-50" />

                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">Liên hệ để nhận tư vấn</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Button asChild variant="outline" className="justify-center text-center h-12 text-xs font-bold">
                                  <a href="tel:0933333313">
                                      <Phone className="mr-2 h-4 w-4" />
                                      ĐIỆN THOẠI
                                  </a>
                                </Button>
                                <Button asChild variant="outline" className="justify-center text-center h-12 text-xs font-bold">
                                  <a href="https://www.facebook.com/people/R%C6%B0%E1%BB%A3u-Vang-An-San/100075802071016/" target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    MESSENGER
                                  </a>
                                </Button>
                                <Button asChild variant="outline" className="justify-center text-center h-12 text-xs font-bold">
                                  <a href="https://id.zalo.me/account/login?continue=http%3A%2F%2Fzalo.me%2F0933333313" target="_blank" rel="noopener noreferrer">
                                    <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770454912/icons8-zalo-50_qgmbxj.png" alt="Zalo Icon" width={20} height={20} className="mr-2 h-5 w-5" />
                                    ZALO
                                  </a>
                                </Button>
                                <Button variant="outline" className="justify-center text-center h-12 text-xs font-bold"><Smartphone className="mr-2 h-4 w-4"/> WHATSAPP</Button>
                            </div>
                        </div>

                        <Separator className="opacity-50" />

                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">Ưu đãi độc quyền An San</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                                <div className="flex items-start gap-2">
                                    <Truck className="h-5 w-5 mt-0.5 text-primary shrink-0"/>
                                    <span>Giao hàng MIỄN PHÍ trong 60 phút, bán kính 5km</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <GlassWater className="h-5 w-5 mt-0.5 text-primary shrink-0"/>
                                    <span>UỐNG THỬ MIỄN PHÍ tại showroom</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Award className="h-5 w-5 mt-0.5 text-primary shrink-0"/>
                                    <span>Cam kết 100% sản phẩm CHẤT LƯỢNG</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CircleDollarSign className="h-5 w-5 mt-0.5 text-primary shrink-0"/>
                                    <span>Cam kết giá bán CẠNH TRANH</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CompensationIcon className="h-5 w-5 mt-0.5 text-primary shrink-0"/>
                                    <span>Bồi thường nếu lỗi vận chuyển</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Users className="h-5 w-5 mt-0.5 text-primary shrink-0"/>
                                    <span>Nhiều sự kiện trải nghiệm khách hàng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <ProductInfoSection details={details} />
      <ProductDetailDescription details={details} />
      <FaqSection />
    </>
  );
}
