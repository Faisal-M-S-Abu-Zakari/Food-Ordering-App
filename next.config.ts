import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // this is mean that my images will come from any https protocol with any hostname
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
