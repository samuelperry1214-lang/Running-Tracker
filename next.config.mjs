/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: 'media.guim.co.uk' },
    ],
  },
};

export default nextConfig;
