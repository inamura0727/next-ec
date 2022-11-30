/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => {
    return [
      {
        source: '/api/items',
        destination: 'http://localhost:8000/items',
      },
      {
        source: '/api/items/:slug',
        destination: 'http://localhost:8000/items/:slug',
      },
      {
        source: '/api/users',
        destination: 'http://localhost:8000/users',
      },
      {
        source: '/api/users/:slug',
        destination: 'http://localhost:8000/users/:slug',
      },
      {
        source: '/api/categories',
        destination: 'http://localhost:8000/categories',
      },
      {
        source: '/api/items/:slug',
        destination: 'http://localhost:8000/categories/:slug',
      },
    ];
  },
};

module.exports = nextConfig;
