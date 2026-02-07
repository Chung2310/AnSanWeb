
'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { Separator } from '@/components/ui/separator';
import type { ProductStructuredDetails, FullProduct, ImageInfo, Category } from '@/lib/types';
import ProductInfoSection from '@/components/product-info-section';
import FaqSection from '@/components/faq-section';
import ProductDetailDescription from '@/components/product-detail-description';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Award, CircleDollarSign, Users, Truck, GlassWater, Zap, Phone, MessageCircle, Smartphone } from 'lucide-react';
import Link from 'next/link';

const CompensationIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.75 14.25H11.25C10.4216 14.25 9.75 13.5784 9.75 12.75V12.75C9.75 11.9216 10.4216 11.25 11.25 11.25H12C12.8284 11.25 13.5 10.5784 13.5 9.75V9.75C13.5 8.92157 12.8284 8.25 12 8.25H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


function ProductDetailPageSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-muted rounded-lg p-8">
          <Skeleton className="w-full aspect-square" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

const generateProductDetails = (product: FullProduct): ProductStructuredDetails => {
    const extractFromDescription = (description: string | undefined, ...keywords: string[]): string | undefined => {
        if (!description) return undefined;
        for (const keyword of keywords) {
            const regex = new RegExp(`(?:${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})\\s*:\\s*([^•\\n]+)`, 'i');
            const match = description.match(regex);
            if (match && match[1]) {
                return match[1].trim().replace(/\.$/, '').trim();
            }
        }
        return undefined;
    };
    
    const findAttr = (...labels: string[]) => {
      if (!product.attributes) return undefined;
      for (const label of labels) {
        const found = product.attributes.find(a => a.label.toLowerCase().trim() === label.toLowerCase().trim());
        if (found && found.value) return found.value;
      }
      return undefined;
    };
    
    const paragraphs = product.description ? [product.description] : [];

    const details: ProductStructuredDetails = {
        title: product.nameVN,
        paragraphs: paragraphs,
        details: product.attributes || [],
        brand: findAttr("thương hiệu"),
        chillFiltered: findAttr("lọc lạnh"),
        region: findAttr("vùng sản xuất", 'xuất xứ') || extractFromDescription(product.description, 'Xuất xứ', 'Vùng'),
        caskType: findAttr("loại thùng"),
        tastingNote: {
            nose: extractFromDescription(product.description, 'Hương thơm', 'Mùi hương'),
            palate: extractFromDescription(product.description, 'Vị giác', 'Vị', 'Hương vị thưởng thức'),
            finish: extractFromDescription(product.description, 'Hậu vị'),
            color: extractFromDescription(product.description, 'Màu sắc', 'của vang'),
        },
        conclusion: extractFromDescription(product.description, "kết luận"),
        howToEnjoy: extractFromDescription(product.description, "cách thưởng thức", "Thưởng thức"),
        foodPairing: extractFromDescription(product.description, "kết hợp món ăn"),
        storage: extractFromDescription(product.description, "bảo quản")
    };

    return details;
}

function ProductDetailView({ product }: { product: FullProduct }) {
  const { categories } = useCategories();
  const details = React.useMemo(() => generateProductDetails(product), [product]);
  const allImages = React.useMemo(() => {
    const images: ImageInfo[] = [];
    if (product.image) images.push(product.image);
    if (product.detailImages) images.push(...product.detailImages);
    return images;
  }, [product]);

  const isWineProduct = React.useMemo(() => {
    if (!product.tags || !categories) return false;

    const getDescendantIds = (parentId: string, allCategories: Category[]): string[] => {
        const children = allCategories.filter(cat => cat.parentId === parentId);
        let ids = children.map(cat => cat.id);
        children.forEach(child => {
            ids = [...ids, ...getDescendantIds(child.id, allCategories)];
        });
        return ids;
    };

    const wineCategory = categories.find(c => c.slug === 'ruou-vang');
    if (!wineCategory) return false;

    const descendantCategoryIds = getDescendantIds(wineCategory.id, categories);
    const allWineIds = [wineCategory.id, ...descendantCategoryIds];
    
    return product.tags.some(tag => allWineIds.includes(tag));
  }, [product.tags, categories]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const getCategoryInfo = (tagId: string) => categories?.find(c => c.id === tagId);

  const breadcrumbs = React.useMemo(() => {
    const paths = [{ label: 'TRANG CHỦ', href: '/' }];
    if (!product.tags || !categories) return paths;

    const getPath = (categoryId: string): { label: string; href: string }[] => {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return [];
      const parentPath = category.parentId ? getPath(category.parentId) : [];
      return [...parentPath, { label: category.name.toUpperCase(), href: `/danh-muc/${category.slug}` }];
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
  
  const getAttribute = (...labels: string[]): string => {
    if (product.attributes) {
      for (const label of labels) {
        const found = product.attributes.find(a => a.label.toLowerCase().trim() === label.toLowerCase().trim());
        if (found && found.value) return found.value;
      }
    }
    if (product.description) {
        for (const label of labels) {
            const regex = new RegExp(`(?:${label.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})\\s*:\\s*([^•\\n]+)`, 'i');
            const match = product.description.match(regex);
            if (match && match[1]) {
                 return match[1].trim().replace(/\.$/, '');
            }
        }
    }
    if (labels.some(l => ['dung tích', 'volume'].includes(l.toLowerCase().trim()))) {
      if (isWineProduct) return '750ml';
    }
    return 'N/A';
  }

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
        <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-12 max-w-screen-2xl mx-auto">
                <div className="lg:col-span-3">
                    <div className="space-y-4">
                        {allImages.map((image, index) => (
                        <div key={index} className="rounded-lg bg-white p-4 flex items-center justify-center relative">
                            {index === 0 && (
                                <>
                                    {hasDiscount ? (
                                        <div className="absolute top-8 left-8 z-10 flex items-center gap-3 rounded-md bg-destructive px-6 py-3 text-lg font-bold uppercase text-destructive-foreground shadow-lg animate-flash">
                                            <Zap className="h-6 w-6" />
                                            <span>Giá Đặc Biệt</span>
                                        </div>
                                    ) : isBestChoice && (
                                        <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold uppercase px-3 py-1 rounded-full shadow-lg z-10">
                                            Best Choice
                                        </div>
                                    )}
                                </>
                            )}
                            <Image
                              src={image.url}
                              alt={`${product.nameVN} - ảnh ${index + 1}`}
                              width={1000}
                              height={1000}
                              className="w-full h-auto object-contain"
                              priority={index === 0}
                            />
                        </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 row-start-1 lg:row-start-auto">
                    <div className="md:sticky md:top-24 space-y-6">
                        <Breadcrumb>
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
                                <BreadcrumbPage>{product.nameVN.toUpperCase()}</BreadcrumbPage>
                            </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        
                        <h1 className="font-headline text-5xl font-bold text-gray-800">
                            {product.nameVN}
                        </h1>

                        {product.shortDescription && (
                          <p className="text-lg text-muted-foreground">{product.shortDescription}</p>
                        )}

                        <Separator />

                        <div className="flex justify-between items-center text-center w-full">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">ĐỘ TUỔI</p>
                                <p className="font-bold text-lg mt-1">{getAttribute('tuổi rượu', 'age')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">NỒNG ĐỘ</p>
                                <p className="font-bold text-lg mt-1">{getAttribute('nồng độ cồn', 'nồng độ', 'alc')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">DUNG TÍCH</p>
                                <p className="font-bold text-lg mt-1">{getAttribute('dung tích', 'volume')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">TÌNH TRẠNG</p>
                                <p className="font-bold text-lg mt-1">{product.status === 'published' ? 'CÒN HÀNG' : 'HẾT HÀNG'}</p>
                            </div>
                        </div>

                        <Separator />
                        
                        {hasDiscount ? (
                            <div className="flex items-baseline gap-4">
                                <span className="text-2xl text-muted-foreground line-through">{formatPrice(originalPrice!)}</span>
                                <span className="text-4xl font-bold text-destructive">{formatPrice(salePrice)}</span>
                                <div className="rounded-md bg-destructive px-3 py-1 text-sm font-bold text-destructive-foreground">
                                    -{discountPercentage}%
                                </div>
                            </div>
                        ) : (
                            <p className="text-4xl font-bold text-primary">
                                {formatPrice(salePrice)}
                            </p>
                        )}

                        <Separator />

                        <div>
                            <h3 className="font-bold uppercase tracking-wider mb-4">Liên hệ để nhận tư vấn</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Button asChild variant="outline" className="justify-center text-center h-14">
                                  <a href="tel:0933333313">
                                      <Phone className="mr-3 h-6 w-6" />
                                      ĐIỆN THOẠI
                                  </a>
                                </Button>
                                <Button asChild variant="outline" className="justify-center text-center h-14">
                                  <a href="https://www.facebook.com/people/R%C6%B0%E1%BB%A3u-Vang-An-San/100075802071016/" target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-3 h-6 w-6" />
                                    MESSENGER
                                  </a>
                                </Button>
                                <Button asChild variant="outline" className="justify-center text-center h-14">
                                  <a href="https://id.zalo.me/account/login?continue=http%3A%2F%2Fzalo.me%2F0933333313" target="_blank" rel="noopener noreferrer">
                                    <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770454912/icons8-zalo-50_qgmbxj.png" alt="Zalo Icon" width={24} height={24} className="mr-3 h-6 w-6" />
                                    ZALO
                                  </a>
                                </Button>
                                <Button variant="outline" className="justify-center text-center h-14"><Smartphone className="mr-3 h-6 w-6"/> WHATSAPP</Button>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-bold uppercase tracking-wider mb-4">Giá độc quyền trên website</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <Truck className="h-6 w-6 mt-0.5 text-primary shrink-0"/>
                                    <span>Giao hàng MIỄN PHÍ trong 60 phút, bán kính 5km</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <GlassWater className="h-6 w-6 mt-0.5 text-primary shrink-0"/>
                                    <span>UỐNG THỬ MIỄN PHÍ tại showroom Công Viên Quy Chế - P. Đông Ngàn - TP Từ Sơn - Tỉnh Bắc Ninh</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Award className="h-6 w-6 mt-0.5 text-primary shrink-0"/>
                                    <span>Cam kết 100% sản phẩm CHẤT LƯỢNG</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CircleDollarSign className="h-6 w-6 mt-0.5 text-primary shrink-0"/>
                                    <span>Cam kết giá bán CẠNH TRANH</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CompensationIcon className="h-6 w-6 mt-0.5 text-primary shrink-0"/>
                                    <span>Cam kết bồi thường nếu xảy ra vấn đề trong quá trình vận chuyển</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="h-6 w-6 mt-0.5 text-primary shrink-0"/>
                                    <span>Nhiều chương trình sinh hoạt cộng đồng gia tăng trải nghiệm khách hàng</span>
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


export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { products, isLoading } = useProducts();

  const product = React.useMemo(() => {
    if (isLoading || !products) return undefined;
    return products.find((p) => p.slug === slug) || null;
  }, [products, slug, isLoading]);

  if (isLoading) {
    return <ProductDetailPageSkeleton />;
  }

  // After loading, if product is explicitly null, it means we didn't find it.
  if (product === null) {
    notFound();
  }

  // If product is found, render the view.
  if (product) {
    return <ProductDetailView product={product} />;
  }

  // Default to skeleton while product is undefined (initial state)
  return <ProductDetailPageSkeleton />;
}
