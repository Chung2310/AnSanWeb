import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/danh-muc-san-pham/:path*',
        destination: '/danh-muc/:path*',
        permanent: true,
      },
      {
        source: '/cua-hang',
        destination: '/danh-muc-san-pham',
        permanent: true,
      },
      {
        source: '/sam-panh-sam-panh-nga-sam-panh-nga-trang-sam-panh-nga-do',
        destination: '/danh-muc/ruou-vang/ruou-vang-sui',
        permanent: true,
      },
      {
        source: '/wp-shop.php',
        destination: '/danh-muc-san-pham',
        permanent: true,
      },
      // Using regex patterns for sitemap redirects to avoid path-to-regexp limitations in Next.js 15
      {
        source: '/:path(wp-sitemap.*)',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/:path(sitemap.*)',
        destination: '/sitemap.xml',
        permanent: false,
      }
    ]
  },
};

export default nextConfig;
