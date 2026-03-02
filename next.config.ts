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
        source: '/danh-muc-san-pham/:slug*',
        destination: '/danh-muc/:slug*',
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
      // Fixed sitemap redirects for Next.js 15 compatibility
      {
        source: '/wp-sitemap:suffix*',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/sitemap:suffix*',
        destination: '/sitemap.xml',
        permanent: false,
      }
    ]
  },
};

export default nextConfig;
