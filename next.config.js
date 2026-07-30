const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tắt warning về nhiều lockfile
  outputFileTracingRoot: path.join(__dirname, '../../'),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // Ưu tiên AVIF (nhỏ hơn 50% so với WebP), fallback WebP
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache ảnh 7 ngày
  },
  // Tree-shaking và optimize tốt hơn
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async redirects() {
    return [
      {
        source: '/danh-muc',
        destination: '/danh-muc-san-pham',
        permanent: true,
      },
      {
        source: '/danh-muc-san-pham/:slugs*',
        destination: '/danh-muc/:slugs*',
        permanent: true,
      },
      {
        source: '/cua-hang',
        destination: '/danh-muc-san-pham',
        permanent: true,
      },
      {
        source: '/wp-shop.php',
        destination: '/danh-muc-san-pham',
        permanent: true,
      },
      {
        source: '/wp-sitemap.xml',
        destination: '/sitemap.xml',
        permanent: true,
      }
    ]
  },
};

module.exports = nextConfig;
