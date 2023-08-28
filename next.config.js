module.exports = {
	reactStrictMode: true,
	compiler: {
		styledComponents: true
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true
	},
	output: "standalone"
};
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true"
});
module.exports = withBundleAnalyzer(module.exports);
