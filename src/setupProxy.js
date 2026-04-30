/**
 * Dev proxy — forwards /api/* from localhost:3000 → localhost:3003
 * This bypasses CSP and CORS for local development only.
 * In production this file is NOT used (nginx/cloud handles routing).
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3003",
      changeOrigin: true,
    })
  );
};
