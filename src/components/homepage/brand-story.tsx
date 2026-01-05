import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function BrandStory() {
  const storyImage = PlaceHolderImages.find(img => img.id === 'brand-story')!;

  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-last lg:order-first">
            <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
              Câu Chuyện Của Chúng Tôi
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Với niềm đam mê bất tận dành cho rượu vang, chúng tôi đã đi khắp thế giới để tuyển chọn những chai vang tinh túy nhất. Mỗi sản phẩm trong bộ sưu tập của chúng tôi không chỉ là một thức uống, mà còn là một tác phẩm nghệ thuật, kết tinh từ di sản, thổ nhưỡng và tâm huyết của người làm rượu.
            </p>
            <p className="mt-4 text-muted-foreground">
              Chúng tôi tin rằng rượu vang là cầu nối cho những khoảnh khắc đáng nhớ. Sứ mệnh của chúng tôi là chia sẻ niềm đam mê này và giúp bạn khám phá ra chai vang hoàn hảo cho riêng mình.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/gioi-thieu">Tìm Hiểu Thêm Về Chúng Tôi</Link>
            </Button>
          </div>
          <div className="h-[500px] w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={storyImage.imageUrl}
              alt={storyImage.description}
              width={800}
              height={1000}
              className="h-full w-full object-cover"
              data-ai-hint={storyImage.imageHint}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
