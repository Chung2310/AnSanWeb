import Image from 'next/image';
import Link from 'next/link';
import { sampleCategories } from '@/lib/placeholder-data';
import { ArrowRight } from 'lucide-react';

export default function CategoryShowcase() {
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
            Khám Phá Theo Loại Vang
          </h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Tìm kiếm chai vang hoàn hảo phù hợp với khẩu vị và sở thích của bạn.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 md:gap-6">
          {sampleCategories.map((category) => (
            <Link key={category.id} href={`/danh-muc-san-pham/${category.slug}`} className="group relative block overflow-hidden rounded-lg">
              <Image
                src={category.image.imageUrl}
                alt={category.name}
                width={800}
                height={600}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={category.image.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-end p-4 md:p-6">
                <h3 className="font-headline text-xl font-bold text-white transition-transform duration-300 group-hover:-translate-y-1">
                  {category.name}
                </h3>
                <ArrowRight className="ml-2 h-5 w-5 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
