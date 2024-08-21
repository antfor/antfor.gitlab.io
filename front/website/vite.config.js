import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cv: resolve(__dirname, 'cv.html'),
        lsys: resolve(__dirname, 'l-system/index.html'),
        calc: resolve(__dirname, 'projects/calculator.html'),
      },
    },
  },
})
