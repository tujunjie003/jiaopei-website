import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        questionBank: resolve(__dirname, 'index.html'),
        cellManager: resolve(__dirname, 'cell-manager.html'),
      }
    }
  }
})
