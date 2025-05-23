/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Заодно и TypeScript ошибки игнорим
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/pages/LoginPage',
      },
      {
        source: '/register',
        destination: '/pages/RegistrationPage',
      },
      {
        source: '/profile',
        destination: '/pages/ProfilePage',
      },
      {
        source: '/settings',
        destination: '/pages/UserSettings',
      },
      {
        source: '/chat-list',
        destination: '/pages/ChatList',
      },
      {
        source: '/create-chat',
        destination: '/pages/СreatingСhat',
      },
      {
        source: '/chat-page',
        destination: '/pages/ChatPage',
      },
    ]
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig 