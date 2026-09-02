/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**/*",
      },

      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/*",
      },
    ],
  },

  env: {
    SERVER_URL: process.env.SERVER_URL,
  },
};

export default nextConfig;
