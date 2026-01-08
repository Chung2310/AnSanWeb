'use client';

import React, { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import { Separator } from '@/components/ui/separator';
import type { TastingNotes, ProductStructuredDetails, FullProduct } from '@/lib/types';
import ProductInfoSection from '@/components/product-info-section';
import FaqSection from '@/components/faq-section';
import ProductDetailDescription from '@/components/product-detail-description';
import { allTags } from '@/lib/tags-data';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, ShoppingCart, Award, CircleDollarSign, Users } from 'lucide-react';
import Link from 'next/link';


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
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

const generateProductDetails = (product: FullProduct): { notes: TastingNotes, details: ProductStructuredDetails } => {
    const findAttr = (label: string) => product.attributes?.find(a => a.label.toLowerCase() === label.toLowerCase())?.value || 'Đang cập nhật';
    
    const notes: TastingNotes = {
        brand: findAttr("thương hiệu"),
        chillFiltered: findAttr("lọc lạnh"),
        region: findAttr("vùng sản xuất"),
        caskType: findAttr("loại thùng"),
        nose: findAttr("mùi hương"),
        palate: findAttr("hương vị"),
        finish: findAttr("hậu vị"),
        color: findAttr("màu sắc"),
    };

    const details: ProductStructuredDetails = {
        title: product.nameVN,
        paragraphs: product.description ? product.description.split('\n\n') : [],
        details: product.attributes || [],
        tastingNote: {
            nose: notes.nose,
            palate: notes.palate,
            finish: notes.finish,
        },
        conclusion: findAttr("kết luận") || "Chưa có kết luận.",
        howToEnjoy: findAttr("cách thưởng thức"),
        foodPairing: findAttr("kết hợp món ăn"),
        storage: findAttr("bảo quản")
    };

    return { notes, details };
}

function ProductDetailView({ product }: { product: FullProduct }) {
  const { details } = useMemo(() => generateProductDetails(product), [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const getTagInfo = (tagId: string) => allTags.find(t => t.id === tagId);

  const breadcrumbs = useMemo(() => {
    const paths = [{ label: 'TRANG CHỦ', href: '/' }];
    const worldTag = product.tags?.find(t => getTagInfo(t)?.id === 'world');
    const scotchTag = product.tags?.find(t => getTagInfo(t)?.id === 'scotch');
    const mainWhiskyCat = worldTag || scotchTag;

    if (mainWhiskyCat) {
        const mainCatInfo = getTagInfo(mainWhiskyCat);
        if (mainCatInfo) {
            paths.push({ label: mainCatInfo.label.toUpperCase(), href: `/danh-muc/${mainCatInfo.id}` });
        }
    }

    const subCategoryTag = product.tags?.find(t => t !== worldTag && t !== scotchTag && getTagInfo(t));
    if (subCategoryTag) {
        const subCatInfo = getTagInfo(subCategoryTag);
        if (subCatInfo) {
             paths.push({ label: subCatInfo.label.toUpperCase(), href: `/danh-muc/world-whisky/${subCatInfo.id}` }); // Assuming structure
        }
    }
    
    return paths;
  }, [product.tags]);
  
  const getAttribute = (label: string) => {
    if (!product.attributes) return null;
    const found = product.attributes.find(a => a.label.toLowerCase().trim() === label.toLowerCase().trim());
    return found?.value;
  }


  return (
    <>
      <div className="bg-white text-black">
        <div className="container mx-auto max-w-7xl py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Image Column */}
            <div className='sticky top-24'>
              {product.image?.url && (
                <div className="rounded-lg p-8" style={{ background: 'linear-gradient(to bottom right, #e6dace, #d1c0a8)'}}>
                  <Image
                    src={product.image.url}
                    alt={product.nameVN}
                    width={800}
                    height={800}
                    className="w-full h-auto object-contain aspect-square"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="space-y-6">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
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

              <Separator />

              <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">ĐỘ TUỔI</p>
                    <p className="font-bold text-lg mt-1">{getAttribute('Tuổi rượu') || getAttribute('age') || 'N/A'}</p>
                  </div>
                   <div>
                    <p className="text-xs text-muted-foreground uppercase">NỒNG ĐỘ CỒN</p>
                    <p className="font-bold text-lg mt-1">{getAttribute('Nồng độ') || getAttribute('Nồng độ cồn') ||'N/A'}</p>
                  </div>
                   <div>
                    <p className="text-xs text-muted-foreground uppercase">DUNG TÍCH</p>
                    <p className="font-bold text-lg mt-1">{getAttribute('Dung tích') || 'N/A'}</p>
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
                    <Button variant="outline" className="justify-start text-left h-14"><Phone className="mr-3"/> Điện Thoại</Button>
                    <Button variant="outline" className="justify-start text-left h-14"><MessageSquare className="mr-3"/> Messenger</Button>
                    <Button variant="outline" className="justify-start text-left h-14"><i className="fab fa-zalo mr-3"></i> Zalo</Button>
                    <Button variant="outline" className="justify-start text-left h-14"><i className="fab fa-whatsapp mr-3"></i> WhatsApp</Button>
                 </div>
               </div>

                <Separator />

                <div>
                    <h3 className="font-bold uppercase tracking-wider mb-4">Giá độc quyền trên website</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-4">
                            <ShoppingCart className="h-5 w-5 mt-0.5 text-primary"/>
                            <span>Giao hàng MIỄN PHÍ trong 60 phút, bán kính 5km nội thành Hà Nội</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <Award className="h-5 w-5 mt-0.5 text-primary"/>
                            <span>Cam kết 100% sản phẩm CHẤT LƯỢNG</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <CircleDollarSign className="h-5 w-5 mt-0.5 text-primary"/>
                            <span>Cam kết giá bán CẠNH TRANH</span>
                        </div>
                         <div className="flex items-start gap-4">
                            <Users className="h-5 w-5 mt-0.5 text-primary"/>
                            <span>Nhiều chương trình sinh hoạt cộng đồng gia tăng trải nghiệm khách hàng</span>
                        </div>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
      <ProductDetailDescription details={details} />
      <FaqSection />
    </>
  );
}


export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { products, isLoading } = useProducts();

  const product = useMemo(() => {
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
