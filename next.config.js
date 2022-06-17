/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    fix: true,
    dirs: ['config', 'components', 'containers', 'contexts', 'helpers', 'pages'],
  }
}

module.exports = nextConfig
