import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// CRA allows JSX in .js files; Vite/esbuild requires .jsx. Scope this to
// src/*.js so Vite's default .jsx/.tsx handling is left intact.
const loadJsFilesAsJsx = {
  name: "load-js-files-as-jsx",
  async transform(code, id) {
    if (!id.match(/src\/.*\.js$/)) return null;
    return transformWithEsbuild(code, id, { loader: "jsx", jsx: "automatic" });
  },
};

export default defineConfig({
  plugins: [loadJsFilesAsJsx, react()],
  // Vite doesn't polyfill `process`; several bundled deps read process.env.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "{}",
  },
  build: {
    outDir: "dist-lib",
    emptyOutDir: true,
    assetsInlineLimit: 0, // emit assets as files, not base64
    lib: {
      entry: resolve(__dirname, "src/package-entry.jsx"),
      name: "AllLearnerApp",
      formats: ["es"], // cjs would force one unsplittable bundle (OOM)
      fileName: (format) => `all-learner-ai-app.${format}.js`,
    },
    rollupOptions: {
      // Share React with the consumer instead of bundling a second copy.
      external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
      output: { globals: { react: "React", "react-dom": "ReactDOM" } },
    },
    cssCodeSplit: false,
  },
});
