import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  defineConfig,
  type PluginOption,
} from 'vite'
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json', // 源文件
          dest: '.',             // 输出到 dist 根目录
        },
        {
          src: 'src/assets/icon16.png',
          dest: './assets/icons',
        },
        {
          src: 'src/assets/icon48.png',
          dest: './assets/icons',
        },
        {
          src: 'src/assets/icon128.png',
          dest: './assets/icons',
        }
      ],
      watch: {
        // options: {},
        // reloadPageOnChange: false,
      },
    }) as unknown as PluginOption
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,  // 不清空输出目录
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'), // 后台脚本
        content: resolve(__dirname, 'src/content.ts')        // 内容脚本
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  server: {
    watch: {
      // 自动重建
      usePolling: true,
      interval: 100
    }
  },
})
