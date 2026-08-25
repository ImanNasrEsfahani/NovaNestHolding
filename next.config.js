/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  reactStrictMode: true,
  // output: "export",
  // distDir: 'out',
  images: {
    domains: [
      // 'res.cloudinary.com',
      'panel-back.novanestholding.com',
      'panel.novanestholding.com',
      'novanestholding.com',
      'localhost',
      'nova-back.novanestholding.com'
    ],
    unoptimized: false,
  },
  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: '/static/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
