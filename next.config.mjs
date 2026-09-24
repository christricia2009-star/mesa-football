/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "64mb",
    },
  },
  async redirects() {
    return [
      { source: "/shoots/sample-sideline", destination: "/shoots/0828-sideline", permanent: false },
      { source: "/shoots/sample-chute", destination: "/shoots/0911-tunnel", permanent: false },
    ];
  },
};

export default nextConfig;
