// @ts-check
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = async (/** @type {string} */ phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  let nextConfig = {
    reactStrictMode: true,
    compiler: {
      // styledComponents: true
    },
    eslint: {
      // ignoreDuringBuilds: true,
    },
  };

  return nextConfig;
};
