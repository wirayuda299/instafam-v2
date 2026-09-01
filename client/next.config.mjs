/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  images: {
    dangerouslyAllowSVG:true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: '/**/*',
      },

      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: '/*',
      }
    ],
  },
  
  env: {
    SERVER_URL: process.env.SERVER_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  },
};

export default nextConfig;
