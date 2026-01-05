import { sampleWines } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ProductSection from "@/components/homepage/product-section";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const wine = sampleWines.find((w) => w.slug === params.slug);

  if (!wine) {
    notFound();
  }
  
  const relatedWines = sampleWines.filter(w => w.type === wine.type && w.id !== wine.id).slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
           {/* TODO: Replace with an image gallery/carousel */}
          <Image
            src={wine.image.imageUrl}
            alt={wine.nameVN}
            width={800}
            height={1000}
            className="w-full rounded-lg shadow-lg object-contain"
            data-ai-hint={wine.image.imageHint}
          />
        </div>
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold">{wine.nameVN}</h1>
          <p className="text-lg text-muted-foreground mt-1">{wine.nameEN}</p>
          <div className="mt-4">
            <Badge variant="outline">{wine.type}</Badge>
            <Badge variant="outline" className="ml-2">{wine.origin}</Badge>
          </div>
          <p className="text-4xl font-bold text-primary mt-6">{formatPrice(wine.price)}</p>
          <p className="mt-6 text-lg text-foreground/80">{wine.description}</p>
          
          <div className="mt-8">
            <h3 className="font-headline text-xl font-semibold mb-4">Chi tiết sản phẩm</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Xuất xứ</TableCell>
                  <TableCell>{wine.origin}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Loại vang</TableCell>
                  <TableCell>{wine.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nồng độ cồn</TableCell>
                  <TableCell>{wine.alcohol}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {relatedWines.length > 0 && (
        <div className="mt-24">
            <ProductSection
                title="Sản Phẩm Tương Tự"
                description="Những chai vang khác cùng loại có thể bạn sẽ thích."
                wines={relatedWines}
            />
        </div>
      )}
    </div>
  );
}
