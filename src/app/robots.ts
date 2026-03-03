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
        '/*?*filter_',   // Chặn tất cả URL chứa filter
        '/*?*q=',        // Chặn trang tìm kiếm
        '/*?*page=',     // Chặn crawl sâu vào phân trang
        '/*?*loai-vang=',
        '/*?*nong-do=',
        '/*?*quoc-gia=',
        '/*?*giong-nho=',
        '/*?*gia=',
        '/*?_rsc=',      // Chặn các request nội bộ của Next.js
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
