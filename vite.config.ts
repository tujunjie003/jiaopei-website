import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    outDir: '../数学飞行棋/课堂版',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html'
    }
  }
})
