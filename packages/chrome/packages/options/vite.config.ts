// import { resolve, dirname } from 'path';
// import { fileURLToPath } from 'url';
import {
  defineConfig,
  // type PluginOption,
} from 'vite'
import react from '@vitejs/plugin-react';
// import { viteStaticCopy } from 'vite-plugin-static-copy';

// const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'manifest.json', // 源文件
    //       dest: '.'             // 输出到 dist 根目录
    //     }
    //   ],
    // }) as unknown as PluginOption
  ],
  build: {
    outDir: '../../dist/options',
  },
  server: {
    watch: {
      // 自动重建
      usePolling: true,
      interval: 100
    }
  },
})
