/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/utils": path.resolve(__dirname, "./utils"),
      "@/styles": path.resolve(__dirname, "./styles"),
    };
    return config;
  },
  // 完全跳过静态优化，强制所有页面为动态
  experimental: {
    staticPageGenerationTimeout: 0,
  },
  // 输出配置
  output: "standalone",
};

module.exports = nextConfig;
