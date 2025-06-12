import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'handle-hoist-non-react-statics',
      transform(code, id) {
        if (id.includes('hoist-non-react-statics')) {
          return {
            code: `const hoistNonReactStatics = require('hoist-non-react-statics'); export default hoistNonReactStatics;`,
            map: null
          };
        }
      }
    }
  ],
  publicDir: 'public',
  assetsInclude: ['**/*.m4a', '**/*.mp3', '**/*.wav'],
  optimizeDeps: {
    exclude: ['**/*.m4a', '**/*.mp3', '**/*.wav']
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name][extname]';
          if (/\.(m4a|mp3|wav)$/.test(assetInfo.name)) {
            return 'assets/audio/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com; font-src 'self' https://fonts.googleapis.com https://fonts.cdnfonts.com https://fonts.gstatic.com; img-src 'self' data: blob: https://images.squarespace-cdn.com https://all-prod-content-service.s3.ap-south-1.amazonaws.com https://all-dev-content-service.s3.ap-south-1.amazonaws.com https://s3.ap-south-1.amazonaws.com https://raw.githubusercontent.com https://cdn.jsdelivr.net; connect-src 'self' *.theall.ai https://all-prod-content-service.s3.ap-south-1.amazonaws.com blob:; media-src 'self' blob: https://all-prod-content-service.s3.ap-south-1.amazonaws.com https://all-dev-content-service.s3.ap-south-1.amazonaws.com https://raw.githubusercontent.com; worker-src 'self' blob: https://d114esnbvw5tst.cloudfront.net; frame-src 'self'; frame-ancestors 'self';"
    }
  }
}); 