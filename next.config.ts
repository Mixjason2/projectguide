import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /* config options here */
};

module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}



export default nextConfig;
