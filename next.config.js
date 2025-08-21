/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bật chế độ nghiêm ngặt của React để phát hiện lỗi sớm
  reactStrictMode: true,

  // Cấu hình hình ảnh - cấu hình cơ bản cho Next.js 15
  images: {
    // Chỉ cho phép các domain cụ thể thay vì wildcard
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ankun.dev',
      },
      {
        protocol: 'https',
        hostname: 'studio.ankun.dev',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
