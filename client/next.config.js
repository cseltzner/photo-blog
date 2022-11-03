/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async redirects() {
    return [
      { source: "/gallery", destination: "/gallery/all", permanent: true },
    ];
  },
};

module.exports = nextConfig;
