import { PlaceHolderImages } from './placeholder-images';
import type { Wine, Category, BlogPost, Testimonial } from './types';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find((img) => img.id === id);
  if (!img) {
    throw new Error(`Image with id ${id} not found`);
  }
  return img;
};

export const sampleWines: Wine[] = [
  {
    id: '1',
    nameVN: 'Château Margaux Premier Grand Cru Classé',
    nameEN: 'Château Margaux Premier Grand Cru Classé',
    slug: 'chateau-margaux-2015',
    price: 35000000,
    origin: 'Pháp',
    type: 'Vang Đỏ',
    alcohol: 13.5,
    description: 'Một biểu tượng của Bordeaux, loại rượu này mang đến sự phức hợp đáng kinh ngạc với hương hoa violet, dâu đen và gỗ tuyết tùng.',
    image: getImage('wine-1'),
    isFeatured: true,
  },
  {
    id: '2',
    nameVN: 'Domaine de la Romanée-Conti Montrachet Grand Cru',
    nameEN: 'Domaine de la Romanée-Conti Montrachet Grand Cru',
    slug: 'drc-montrachet-2018',
    price: 95000000,
    origin: 'Pháp',
    type: 'Vang Trắng',
    alcohol: 14,
    description: 'Loại rượu vang trắng được săn lùng nhất thế giới, thể hiện sự cân bằng hoàn hảo giữa sự đậm đà, khoáng chất và độ chua.',
    image: getImage('wine-2'),
    isFeatured: true,
  },
  {
    id: '3',
    nameVN: 'Whispering Angel Rosé',
    nameEN: 'Whispering Angel Rosé',
    slug: 'whispering-angel-rose',
    price: 1200000,
    origin: 'Pháp',
    type: 'Vang Hồng',
    alcohol: 13,
    description: 'Loại vang hồng tinh tế từ Provence với hương thơm của dâu tây, đào và một chút hương hoa.',
    image: getImage('wine-3'),
    isNew: true,
  },
  {
    id: '4',
    nameVN: 'Krug Grande Cuvée Brut Champagne',
    nameEN: 'Krug Grande Cuvée Brut Champagne',
    slug: 'krug-grande-cuvee',
    price: 8500000,
    origin: 'Pháp',
    type: 'Vang Sủi',
    alcohol: 12.5,
    description: 'Một loại Champagne sang trọng với sự phức hợp của hương bánh mì nướng, các loại hạt và trái cây họ cam quýt.',
    image: getImage('wine-4'),
    isFeatured: true,
  },
  {
    id: '5',
    nameVN: 'Château d\'Yquem Sauternes',
    nameEN: 'Château d\'Yquem Sauternes',
    slug: 'chateau-dyquem-2011',
    price: 15000000,
    origin: 'Pháp',
    type: 'Vang Tráng Miệng',
    alcohol: 14.5,
    description: 'Vua của các loại rượu vang ngọt, với các lớp hương mật ong, mơ, và hạnh nhân.',
    image: getImage('wine-5'),
    isNew: true,
  },
  {
    id: '6',
    nameVN: 'Penfolds Grange Bin 95',
    nameEN: 'Penfolds Grange Bin 95',
    slug: 'penfolds-grange-2017',
    price: 22000000,
    origin: 'Úc',
    type: 'Vang Đỏ',
    alcohol: 14.5,
    description: 'Biểu tượng của Úc, một loại Shiraz đậm đà và mạnh mẽ với hương vị của mận, sô cô la và gia vị.',
    image: getImage('wine-6'),
    isFeatured: true,
  },
];

export const sampleCategories: Category[] = [
  { id: '1', name: 'Vang Đỏ', slug: 'vang-do', image: getImage('category-red') },
  { id: '2', name: 'Vang Trắng', slug: 'vang-trang', image: getImage('category-white') },
  { id: '3', name: 'Vang Hồng', slug: 'vang-hong', image: getImage('category-rose') },
  { id: '4', name: 'Vang Sủi', slug: 'vang-sui', image: getImage('category-sparkling') },
  { id: '5', name: 'Vang Tráng Miệng', slug: 'vang-trang-mieng', image: getImage('category-dessert') },
];

export const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Nghệ Thuật Kết Hợp Rượu Vang và Ẩm Thực',
    slug: 'nghe-thuat-ket-hop-ruou-vang-va-am-thuc',
    excerpt: 'Khám phá những nguyên tắc cơ bản để tạo ra sự kết hợp hoàn hảo giữa rượu vang và các món ăn, nâng tầm trải nghiệm ẩm thực của bạn.',
    date: '15 Tháng 7, 2024',
    image: getImage('blog-2'),
  },
  {
    id: '2',
    title: 'Hướng Dẫn Cho Người Mới Bắt Đầu Về Các Vùng Rượu Vang Nổi Tiếng',
    slug: 'huong-dan-cac-vung-ruou-vang',
    excerpt: 'Từ Bordeaux đến Thung lũng Napa, chúng tôi sẽ đưa bạn đi qua một chuyến tham quan các vùng rượu vang danh giá nhất thế giới.',
    date: '05 Tháng 7, 2024',
    image: getImage('blog-1'),
  },
  {
    id: '3',
    title: 'Quy Trình Sản Xuất Rượu Vang: Từ Vườn Nho Đến Ly Rượu',
    slug: 'quy-trinh-san-xuat-ruou-vang',
    excerpt: 'Tìm hiểu các bước phức tạp trong quá trình sản xuất rượu vang, từ việc thu hoạch nho đến quá trình ủ và đóng chai.',
    date: '25 Tháng 6, 2024',
    image: getImage('blog-3'),
  },
];

export const sampleTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Anh Trần Tuấn',
    title: 'Doanh nhân',
    quote: 'Bộ sưu tập rượu vang ở đây thật sự ấn tượng. Tôi đã tìm thấy những chai vang hiếm mà tôi đã tìm kiếm từ lâu. Dịch vụ tư vấn rất chuyên nghiệp.',
    avatar: getImage('avatar-1'),
  },
  {
    id: '2',
    name: 'Chị Minh Anh',
    title: 'Chuyên gia ẩm thực',
    quote: 'Chất lượng rượu vang vượt xa mong đợi của tôi. Mỗi chai vang đều kể một câu chuyện riêng. Chắc chắn tôi sẽ quay lại.',
    avatar: getImage('avatar-2'),
  },
  {
    id: '3',
    name: 'Anh Quốc Bảo',
    title: 'Nhà sưu tập rượu',
    quote: 'Là một nhà sưu tập, tôi đánh giá cao sự đa dạng và chất lượng của các loại rượu vang ở đây. Trang web rất trang nhã và dễ sử dụng.',
    avatar: getImage('avatar-3'),
  },
];
