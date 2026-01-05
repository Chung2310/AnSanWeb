import { PlaceHolderImages } from './placeholder-images';
import type { CategoryBannerProps } from '@/components/category-banner';

const getImage = (id: string) => {
    const img = PlaceHolderImages.find((img) => img.id === id);
    if (!img) {
      throw new Error(`Image with id ${id} not found`);
    }
    return img;
  };

export const categoryData: CategoryBannerProps[] = [
    {
        slug: 'whisky-campbeltown',
        breadcrumbs: [
            { label: 'Trang chủ', href: '/' },
            { label: 'Whisky Campbeltown', href: '/danh-muc/scotch-whisky/whisky-campbeltown' }
        ],
        title: 'Whisky Campbeltown',
        description: 'Campbeltown, vùng đất từng là "thủ phủ whisky", nay chỉ còn ba nhà máy chưng cất hoạt động, mang đến hương vị whisky đậm đà, nhiều dầu, với chút mặn mòi của biển cả, trái cây khô và khói than bùn.',
        image: getImage('banner-campbeltown'),
    },
    // Add other category banner data here
];
