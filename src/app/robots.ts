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
        '/*?*filter_',
        '/*?*q=',
        '/*?*page=',
        '/*?*loai-vang=',
        '/*?*nong-do=',
        '/*?*quoc-gia=',
        '/*?*giong-nho=',
        '/*?*gia=',
        '/*?_rsc=',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
