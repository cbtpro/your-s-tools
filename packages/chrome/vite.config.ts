import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      watch: isDev ? {} : null,
      rollupOptions: {
        input: {
          background: resolve(__dirname, 'src/background.ts'),
          content: resolve(__dirname, 'src/content.ts'),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name]-[hash].js',
          assetFileNames: '[name]-[hash].[ext]'
        }
      }
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          { src: 'manifest.json', dest: '.' },
          { src: 'src/assets/icon*.png', dest: './assets/icons' },
          // 只有生产模式才需要“搬运”，开发模式由子包直接写入
          ...(isDev ? [] : [
            { src: '../newtab/dist/*', dest: './newtab' },
            { src: '../options/dist/*', dest: './options' },
            { src: '../popup/dist/*', dest: './popup' }
          ])
        ]
      })
    ]
  };
});
