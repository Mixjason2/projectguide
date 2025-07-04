/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dth.travel',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
