import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const packageJson = require('./package.json');
const PACKAGE_NAME = packageJson.name;
const PACKAGE_VERSION = packageJson.version;

export default defineConfig(({ command, mode }) => {
  const isDevBuild = command === 'build' && mode === 'development'
  const isNodeModule = (id: string) => id.includes('node_modules');

  console.debug(
    'Vite Config - Command:',
    command,
    'Mode:',
    mode,
    'Is Dev Build:',
    isDevBuild,
    'Package:',
    PACKAGE_NAME,
    'Version:',
    PACKAGE_VERSION,
  );

  return {
    base: './',
    plugins: [
      react(),
    ],
    build: {
      // 开发时直接投递到 chrome 的开发目录，生产时就地打包
      outDir: isDevBuild ? '../chrome/dist/newtab' : 'dist',
      watch: isDevBuild ? {
        // 建议添加，防止构建过于频繁
        buildDelay: 500,
        // 排除掉干扰项
        exclude: ['node_modules/**', 'dist/**'],
      } : null,
      // 关键：防止开发模式下 newtab 删掉 chrome 目录下的其他东西
      emptyOutDir: !isDevBuild,
      sourcemap: isDevBuild,
      minify: isDevBuild ? false : 'esbuild',
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        // 确保输出的文件名固定，方便 chrome 引用（如果需要的话）
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
          manualChunks(id) {
            if (!isNodeModule(id)) return undefined;
            return 'vendor';
          },
        },
      },
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },

    server: {
      host: '::',
      port: 8000,
      watch: {
        usePolling: true,
        interval: 1000,
        binaryInterval: 3000,
        ignored: ['**/node_modules/**'],
      },
    },
  }
})
