import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        // Inline JS if < 4KB
        assetFileNames: 'assets/[name][extname]',
        manualChunks: undefined
      }
    },
    // Inline small assets as base64
    assetsInlineLimit: 10000,
  },
  // Disable HTML injection so output index.html is self-contained
  appType: 'mpa'
})
