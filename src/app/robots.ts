import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/login',
        '/*?*filter_', // Chặn bot crawl các bộ lọc phức tạp gây nặng server
        '/*?*q=',      // Chặn crawl kết quả tìm kiếm
        '/*?*page=',   // Hạn chế bot crawl sâu vào các trang phân trang
      ],
    },
    sitemap: 'https://ruouvangansan.vn/sitemap.xml',
  }
}
