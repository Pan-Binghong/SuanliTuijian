import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: './', // 设置基础路径为相对路径
  plugins: [vue()],
  server: {
    port: 13000,  // 设置端口，可以根据需要调整
    open: true,  // 自动打开浏览器
    historyApiFallback: true,  // 处理 history 模式的路由刷新问题
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
