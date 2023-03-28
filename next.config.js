module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  output: "standalone",
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
