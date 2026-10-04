import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';
import { visualizer } from 'rollup-plugin-visualizer';
import Pages from 'vite-plugin-pages';

export default defineConfig({
  base: '/',
  plugins: [
    react(),

    // gzip + brotli
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' }),

    visualizer({ open: false }),

    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 70 },
      pngquant: { quality: [0.65, 0.8], speed: 4 },
      svgo: { plugins: [{ name: 'removeViewBox' }] },
      webp: { quality: 75 },
    }),

    Pages({
      dirs: 'src/pages',
      extensions: ['tsx'],
    }),
  ],

  build: {
    sourcemap: false, // optional
    emptyOutDir: true,

    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },

  // 🔥 disable HTML caching (for dev & prod)
  server: {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    },
    host: '0.0.0.0',
    port: 3000,
    open: true,
  },
});
