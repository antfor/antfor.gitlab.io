import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  base: '/',

  server: {
    host: 'local.anton-forsberg.com',
  },

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cv: resolve(__dirname, 'cv.html'),
        lsys: resolve(__dirname, 'projects/l-system.html'),
        calc: resolve(__dirname, 'projects/intrest.html'),
      },
    },
  },

  css :{
    preprocessorOptions : {
      scss: {
        api: "modern-compiler",
        quietDeps: true,
      }, 
    }, 
  },

  resolve: {
    alias: {
      src: "/src",
      components: "/src/components",
      scss: "/src/bootstrap"
    },
  },

})
