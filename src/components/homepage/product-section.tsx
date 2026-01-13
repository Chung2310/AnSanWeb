import WineCard from '@/components/wine-card';
import type { Product } from '@/lib/types';

type ProductSectionProps = {
  title: string;
  description: string;
  products: Product[];
};

export default function ProductSection({ title, description, products }: ProductSectionProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <WineCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
