'use client';
import WineCard from "@/components/wine-card";
import { sampleWines } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import ProductCategoryNav from "@/components/layout/product-category-nav";

const filters = {
  "THƯƠNG HIỆU": [
    { label: "GLEN SCOTIA", count: 2 },
    { label: "HAZELBURN", count: 1 },
    { label: "LONGROW", count: 1 },
    { label: "SPRINGBANK", count: 10 },
  ],
  "ĐỘ TUỔI": [
    { label: "12-18 NĂM", count: 4 },
    { label: "18-30 NĂM", count: 4 },
    { label: "DƯỚI 12 NĂM", count: 4 },
    { label: "TRÊN 30 NĂM", count: 2 },
  ],
  "LOẠI THÙNG": [
    { label: "BOURBON", count: 10 },
    { label: "PORT", count: 1 },
    { label: "SHERRY", count: 3 },
  ],
  "LỌC LẠNH": [
    { label: "CÓ LỌC LẠNH", count: 3 },
    { label: "KHÔNG CÓ LỌC LẠNH", count: 11 },
  ],
  "KHOẢNG GIÁ": [
    "DƯỚI 5 TRIỆU",
    "5-10 TRIỆU",
    "10-20 TRIỆU",
    "20-50 TRIỆU",
    "50-100 TRIỆU",
    "TRÊN 100 TRIỆU",
  ],
};

const sortingOptions = ["MẶC ĐỊNH", "MỚI NHẤT", "GIÁ TĂNG DẦN", "GIÁ GIẢM DẦN"];

const FilterGroup = ({ title, options }: { title: string, options: (string | { label: string, count: number })[] }) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-4">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          className="rounded-none bg-secondary text-secondary-foreground hover:bg-gray-300 hover:text-black text-xs h-auto py-1 px-3 border-gray-300"
        >
          {typeof option === 'string' ? option : `${option.label} (${option.count})`}
        </Button>
      ))}
    </div>
  </div>
);

export default function ProductsPage() {
  const products = sampleWines.filter(wine => wine.tags?.includes('tasting-set'));

  return (
    <div className="bg-white text-black">
      <ProductCategoryNav />
      <div className="container py-12">
        <div className="text-left mb-4">
          <h1 className="font-headline text-xl font-bold uppercase tracking-wider">Set Thử Rượu</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Column */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Lọc sản phẩm</h2>
            {Object.entries(filters).map(([title, options]) => (
              <FilterGroup key={title} title={title} options={options} />
            ))}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 text-sm">
              <p>HIỂN THỊ {products.length} CỦA {products.length} KẾT QUẢ</p>
              <div className="flex items-center gap-2">
                <span className="uppercase">Sắp xếp theo</span>
                {sortingOptions.map((opt, i) => (
                  <Button
                      key={opt}
                      variant={i === 0 ? "outline" : "ghost"}
                      className={`text-xs h-auto py-1 px-3 rounded-none ${i === 0 ? 'border-black' : 'border-transparent'}`}
                  >
                      {opt}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((wine) => (
                <WineCard key={wine.id} wine={wine} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
