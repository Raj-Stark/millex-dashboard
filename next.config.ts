import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"],
    // Optional: if you need to specify path patterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dgmyvxbxa/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
