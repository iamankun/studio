/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    // turbopackPersistentCaching may cause issues if not supported by your Next.js version.
    turbopackPersistentCaching: true,
    // optimizeCss is experimental; disable if you encounter build errors.
    optimizeCss: true,
    devIndicators: {
      autoPrerender: true,
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Host": "*",
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // If you encounter issues, try adding the following for debugging:
  // reactStrictMode: true,
  // swcMinify: true,
  allowedCorsOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "192.168.1.0",
    "localhost",
  ],
};
