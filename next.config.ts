import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder images for the mock phase. Replace with real storage later.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
