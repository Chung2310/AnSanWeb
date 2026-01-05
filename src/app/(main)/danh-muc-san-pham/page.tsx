import WineCard from "@/components/wine-card";
import { sampleWines } from "@/lib/placeholder-data";

export default function ProductsPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl font-bold">Danh Mục Sản Phẩm</h1>
        <p className="mt-2 text-lg text-muted-foreground">Tất cả các chai vang thượng hạng trong bộ sưu tập của chúng tôi.</p>
      </div>
      {/* TODO: Add filters and sorting controls */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sampleWines.map((wine) => (
          <WineCard key={wine.id} wine={wine} />
        ))}
      </div>
    </div>
  );
}
