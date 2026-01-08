'use client';

import { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import { Separator } from '@/components/ui/separator';
import type { TastingNotes, ProductStructuredDetails, FullProduct } from '@/lib/types';
import ProductInfoSection from '@/components/product-info-section';
import FaqSection from '@/components/faq-section';
import ProductDetailDescription from '@/components/product-detail-description';

function ProductDetailPageSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <Skeleton className="w-full aspect-square" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-24 w-full" />
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
        paragraphs: product.description ? product.description.split('\n\n') : ["Chưa có mô tả chi tiết cho sản phẩm này."],
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
  const { notes, details } = useMemo(() => {
    return generateProductDetails(product);
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <>
      <div className="bg-white text-black">
        <div className="container mx-auto max-w-5xl py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Image Column */}
            <div className='sticky top-24'>
              {product.image?.url && (
                <div className="bg-secondary rounded-lg p-8 ">
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
               {/* Detail Images Gallery */}
              {product.detailImages && product.detailImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {product.detailImages.map((img, index) => (
                    <div key={index} className="bg-secondary rounded-lg p-2">
                       <Image
                        src={img.url}
                        alt={`${product.nameVN} detail image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-auto object-contain aspect-square"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="space-y-6">
              <div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-gray-800">
                  {product.nameVN}
                </h1>
                <div className="mt-4">
                  <p className="text-3xl font-semibold text-primary">
                    {formatPrice(product.price)}
                    {product.priceDescription && <span className="text-xl text-muted-foreground ml-2">{product.priceDescription}</span>}
                  </p>
                  {product.secondaryPrice && (
                    <p className="text-2xl font-semibold text-primary mt-2">
                      {formatPrice(product.secondaryPrice)}
                      {product.secondaryPriceDescription && <span className="text-lg text-muted-foreground ml-2">{product.secondaryPriceDescription}</span>}
                    </p>
                  )}
                </div>
              </div>
              
              {product.description && (
                  <div>
                      <Separator className="my-6" />
                      <h2 className="text-lg font-bold text-gray-700 mb-4">
                          Mô Tả Sản Phẩm
                      </h2>
                      <div 
                          className="prose prose-sm dark:prose-invert max-w-none text-gray-600 leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                      >
                      </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ProductInfoSection notes={notes} />
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
