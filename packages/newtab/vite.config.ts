import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const isDevBuild = command === 'build' && mode === 'development'

  console.error(
    'Vite Config - Command:',
    command,
    'Mode:',
    mode,
    'Is Dev Build:',
    isDevBuild
  )

  return {
    base: './',
    plugins: [react()],
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
      rollupOptions: {
        // 确保输出的文件名固定，方便 chrome 引用（如果需要的话）
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
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
