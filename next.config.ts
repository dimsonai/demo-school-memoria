import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Игнорируем ошибки проверки типов при сборке (важно для демо)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорируем ошибки линтера (правил написания кода) при сборке
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
