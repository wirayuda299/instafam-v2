/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  images: {
    dangerouslyAllowSVG: true,
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
