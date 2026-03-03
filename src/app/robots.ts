import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/login',
        '/*?*filter_', // Chặn bot crawl các bộ lọc phức tạp (Crawler Trap)
        '/*?*q=',      // Chặn crawl kết quả tìm kiếm
        '/*?*page=',   // Hạn chế bot crawl sâu vào các trang phân trang
        '/*?*loai-vang=',
        '/*?*nong-do=',
        '/*?*quoc-gia=',
        '/*?*giong-nho=',
      ],
    },
    sitemap: 'https://ruouvangansan.vn/sitemap.xml',
  }
}
