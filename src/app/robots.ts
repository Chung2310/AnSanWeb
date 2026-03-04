import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ruouvangansan.vn'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/login',
        '/*?*filter_',   // Chặn tham số lọc mới
        '/*?*q=',        // Chặn tìm kiếm
        '/*?*page=',     // Chặn crawl sâu phân trang
        '/*?*loai-vang=', // Chặn các tham số lọc cũ
        '/*?*nong-do=',
        '/*?*quoc-gia=',
        '/*?*giong-nho=',
        '/*?*gia=',
        '/*?_rsc=',      // Chặn request nội bộ Next.js
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
