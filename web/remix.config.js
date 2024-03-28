/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  publicPath: "/_static/build/",
  server: "server.ts",
  serverBuildPath: "server/index.js",
  serverModuleFormat: "cjs",
  serverDependenciesToBundle: "all"
};
