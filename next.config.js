const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withPlugins([withBundleAnalyzer, withImages], {
  images: {
    domains: ["upload-os-bbs.mihoyo.com"],
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
});
