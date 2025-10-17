import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "https://expense-tracker-oqak.onrender.com/api/:path*", 
  //     },
  //   ];
  // },
};

export default nextConfig;
