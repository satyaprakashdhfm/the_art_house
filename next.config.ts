import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 is the default; 90 keeps fine brushwork sharp on small artwork tiles.
    qualities: [75, 90],
    remotePatterns: [
      // Images uploaded from /admin (Supabase Storage)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // Google profile photos
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Placeholder artwork from the mock phase; replace from /admin
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
