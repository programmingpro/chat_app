/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
}

module.exports = nextConfig 