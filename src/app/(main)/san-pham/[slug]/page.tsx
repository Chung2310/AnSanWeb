
'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { Separator } from '@/components/ui/separator';
import type { ProductStructuredDetails, FullProduct, ImageInfo } from '@/lib/types';
import ProductInfoSection from '@/components/product-info-section';
import FaqSection from '@/components/faq-section';
import ProductDetailDescription from '@/components/product-detail-description';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Award, CircleDollarSign, Users, Truck, GlassWater } from 'lucide-react';
import Link from 'next/link';

const ZaloIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_303_2)">
      <path d="M2.57142 10.4C2.57142 5.2 5.2 2.57142 10.4 2.57142H13.6C18.8 2.57142 21.4286 5.2 21.4286 10.4V13.6C21.4286 18.8 18.8 21.4286 13.6 21.4286H10.4C5.2 21.4286 2.57142 18.8 2.57142 13.6V10.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.72142 12.3143C8.72142 11.0857 9.8 10.0286 11.2 10.0286H12.8C13.56 10.0286 14.1857 10.6543 14.1857 11.4143V11.4143C14.1857 12.1743 13.56 12.8 12.8 12.8H10.0571V14.1429H12.8C14.2 14.1429 15.2571 13.0857 15.2571 11.7143V11.4143C15.2571 10.0286 14.2 8.72142 12.8 8.72142H11.2C9.8 8.72142 8.72142 9.77856 8.72142 11.1428" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_303_2">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M16.5946 13.336C16.3866 13.232 15.3466 12.712 15.1386 12.636C14.9306 12.56 14.7946 12.508 14.6586 12.716C14.5226 12.924 14.0506 13.524 13.9146 13.676C13.7786 13.828 13.6426 13.852 13.4346 13.748C12.4426 13.252 11.5946 12.78 10.9306 12.012C10.4586 11.484 10.1546 10.836 10.0186 10.556C9.88264 10.276 10.0106 10.148 10.1226 10.036C10.2266 9.93204 10.3546 9.77204 10.4826 9.64404C10.6106 9.51604 10.6586 9.41204 10.7626 9.22804C10.8666 9.04404 10.8146 8.88404 10.7386 8.73204C10.6626 8.58004 10.0346 7.10004 9.79464 6.54804C9.56264 6.00404 9.32264 6.06804 9.15464 6.06004C8.98664 6.05204 8.85064 6.05204 8.71464 6.05204C8.57864 6.05204 8.36264 6.10404 8.18264 6.31204C8.00264 6.52004 7.42664 7.06404 7.42664 8.12804C7.42664 9.19204 8.21064 10.204 8.31464 10.356C8.41864 10.508 9.75464 12.74 11.9146 13.62C13.8346 14.4 14.0746 14.348 14.4986 14.324C14.9226 14.3 15.9626 13.78 16.1426 13.204C16.3226 12.628 16.3226 12.124 16.2706 12.02C16.2186 11.916 16.1146 11.864 15.9546 11.788L15.9826 11.772C16.3866 11.956 16.7146 12.14 16.8266 12.244C17.0746 12.476 16.8026 13.44 16.5946 13.336Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 15.0932 4.41379 17.7818 6.5 19.5L5.5 21L7.5 20C9.11024 20.6599 10.5186 21 12 21Z" stroke="currentColor" strokeWidth="1.s" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
    return 'N/A';
  }


  return (
    <>
      <div className="bg-white text-black">
        <div className="container mx-auto max-w-7xl py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                <div className="lg:col-span-1">
                    <div className="space-y-4">
                        {allImages.map((image, index) => (
                        <div key={index} className="rounded-lg bg-white p-4 flex items-center justify-center">
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

                <div className="lg:col-span-1 row-start-1 lg:row-start-auto">
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

                        <div className="grid grid-cols-4 gap-4 text-center">
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
                        
                        <p className="text-4xl font-bold text-primary">
                            {formatPrice(product.price)}
                        </p>

                        <Separator />

                        <div>
                            <h3 className="font-bold uppercase tracking-wider mb-4">Liên hệ để nhận tư vấn</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="justify-center text-center h-14"><Phone className="mr-3 h-5 w-5"/> ĐIỆN THOẠI</Button>
                                <Button variant="outline" className="justify-center text-center h-14"><MessageSquare className="mr-3 h-5 w-5"/> MESSENGER</Button>
                                <Button variant="outline" className="justify-center text-center h-14"><ZaloIcon className="mr-3 h-5 w-5"/> ZALO</Button>
                                <Button variant="outline" className="justify-center text-center h-14"><WhatsAppIcon className="mr-3 h-5 w-5"/> WHATSAPP</Button>
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

