import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh", // allow all ufs.sh subdomains
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
