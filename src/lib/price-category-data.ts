import { PlaceHolderImages } from './placeholder-images';
import type { CategoryBannerProps } from '@/components/category-banner';

const getImage = (id: string) => {
    const img = PlaceHolderImages.find((img) => img.id === id);
    if (!img) {
      throw new Error(`Image with id ${id} not found`);
    }
    return img;
  };

export const priceCategoryData: Omit<CategoryBannerProps, 'breadcrumbs'>[] = [
    {
        slug: 'duoi-5-trieu',
        title: 'Whisky Dưới 5 Triệu',
        description: 'Khám phá những chai whisky chất lượng với mức giá phải chăng, phù hợp để bắt đầu hành trình thưởng thức hoặc làm quà tặng ý nghĩa.',
        image: getImage('price-category-5'),
    },
    {
        slug: 'duoi-10-trieu',
        title: 'Whisky từ 5 - 10 Triệu',
        description: 'Nâng tầm trải nghiệm với những dòng single malt và blended whisky phức hợp, mang đến hương vị phong phú và sâu lắng hơn.',
        image: getImage('price-category-10'),
    },
    {
        slug: 'duoi-20-trieu',
        title: 'Whisky từ 10 - 20 Triệu',
        description: 'Bộ sưu tập dành cho những người sành sỏi, bao gồm các phiên bản đặc biệt và những chai whisky có tuổi đời đáng ngưỡng mộ.',
        image: getImage('price-category-20'),
    },
    {
        slug: 'duoi-50-trieu',
        title: 'Whisky từ 20 - 50 Triệu',
        description: 'Những tuyệt tác whisky hiếm có, thể hiện đỉnh cao của nghệ thuật chưng cất và ủ rượu, dành cho những dịp quan trọng nhất.',
        image: getImage('price-category-50'),
    },
];
