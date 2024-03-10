// /**
//  * @type {import('@remix-run/dev').AppConfig}
//  */
// module.exports = {
//   appDirectory: "app",
//   cacheDirectory: "./node_modules/.cache/remix",
//   assetsBuildDirectory: "public/build",
//   publicPath: "/_static/build/",
//   serverBuildTarget: "arc",
//   server: "./server.ts",
//   ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.css.map", "**/*.scss", "**/*.test.{js,jsx,ts,tsx}"],
//   serverDependenciesToBundle: "all",
// };

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.css.map", "**/*.scss", "**/*.test.{js,jsx,ts,tsx}"],
  publicPath: "/_static/build/",
  server: "server.ts",
  serverBuildPath: "server/index.mjs",
  serverModuleFormat: "esm",
};