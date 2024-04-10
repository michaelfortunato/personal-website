// @ts-check
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
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
    output: "standalone",
  };
  if (phase != PHASE_DEVELOPMENT_SERVER) {
    // NOTE: Alternatively, we can make this less imperative by
    // returning a different config object and the env field
    // On production builds, we should be are vars from
    // whatever platform we are using right now its Vercel.
    // process.env.GIT_REPO_NAME = process.env.VERCEL_GIT_REPO_SLUG;
    // process.env.GIT_COMMIT_SHA = process.env.VERCEL_GIT_COMMIT_SHA;
    // process.env.GIT_COMMIT_BRANCH = process.env.VERCEL_GIT_COMMIT_REF;
  }

  return nextConfig;
};
