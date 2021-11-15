import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import { createSvg } from './src/icons/index'
const srcPth =path.resolve(__dirname,'\src')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvg('./src/icons/svg/'),
    Components({
      resolvers: [
        ElementPlusResolver()
      ]
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: false,
    https: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9527',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: 
      {
        "@":"/src"
      }
  }
})
