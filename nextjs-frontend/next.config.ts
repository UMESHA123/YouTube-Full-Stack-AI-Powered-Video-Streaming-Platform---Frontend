import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // This matches any request starting with /api
        source: "/api/:path*",
        // This redirects it to your Render backend
        destination: "https://youtube-expressjs.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;