/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf2pic', 'sharp'],
  },
  // Allow large PDF uploads (50MB)
  api: {
    bodyParser: false,
  },
};

module.exports = nextConfig;
