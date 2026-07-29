/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
        hostname: '**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
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
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `http://127.0.0.1:${process.env.BACKEND_PORT || 3001}/api/v1/:path*`,
      },
      {
        source: '/api-docs/:path*',
        destination: `http://127.0.0.1:${process.env.BACKEND_PORT || 3001}/api-docs/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
