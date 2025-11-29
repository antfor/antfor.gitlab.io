import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: 'local.anton-forsberg.com',
    allowedHosts: ['local.anton-forsberg.com'],
  },

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cv: resolve(__dirname, 'cv.html'),
        lsys: resolve(__dirname, 'projects/l-system.html'),
        calc: resolve(__dirname, 'projects/interest.html'),
        orm: resolve(__dirname, 'projects/orm.html'),
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        //api: "modern-compiler",
        quietDeps: true,
        silenceDeprecations: ["import", "color-functions", "global-builtin"],
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
