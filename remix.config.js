/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  cacheDirectory: "./node_modules/.cache/remix",
  assetsBuildDirectory: "public/build",
  publicPath: "/_static/build/",
  serverBuildTarget: "arc",
  server: "./server.ts",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.css.map", "**/*.scss", "**/*.test.{js,jsx,ts,tsx}"],
  future: {
    unstable_cssModules: true,
  },
};
