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
    },
    watch: {
      // 1. 延迟构建（单位：毫秒）
      // 当你保存文件时，Vite 会等待 500ms，看是否还有后续改动，再触发构建。
      // 这能有效防止“连击保存”导致的频繁 CPU 峰值。
      buildDelay: 500, 

      // 2. 底层监听器配置
      chokidar: {
        // 增加轮询间隔（毫秒）。默认可能非常快。
        // 设置为 1000ms（1秒）能极大缓解 Windows 的磁盘扫描压力。
        interval: 1000, 
        
        // 必须忽略 dist 和 node_modules，防止“产物变动 -> 触发监听 -> 再次构建”的死循环
        ignored: ['**/node_modules/**', '**/dist/**'],
        
        // 在 Windows 11 上，开启 usePolling 有时比原生事件更省资源
        usePolling: true, 
      },

      // 3. 排除不必要的文件，减少内存中监听器的数量
      exclude: ['node_modules/**', 'dist/**'],
    },
  },
  server: {
    watch: {
      // 这里的 chokidar 配置直接影响扫描频率，尤其是在 Windows 上，默认配置可能导致文件变动时反应迟钝或不稳定。以下配置能显著提升开发体验：
      usePolling: true,   // 在 Windows 上，有时开启轮询反而更稳定
      interval: 1000,     // 检查间隔（毫秒），调大这个值（如 1000 或 2000）能救命
      binaryInterval: 3000,
      ignored: [
        // 忽略不必要的目录，减少扫描负担
        '**/node_modules/**',
        // '**/dist/**'
      ],
    },
  },
})
