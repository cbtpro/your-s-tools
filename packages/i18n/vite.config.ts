import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        provider: path.resolve(__dirname, 'src/provider.tsx'),
      },
      name: 'i18n',
      formats: ['es', 'cjs'],
      fileName: (format) => `[name].${format}.js`,
    },
    rollupOptions: {
      external: [
        'i18next',
        'react',
        'react-dom/client',
        'react-i18next',
        'react-router-dom',
      ],
      output: {
        globals: {
          i18next: 'i18next',
          react: 'React',
          'react-dom/client': 'ReactDOMClient',
          'react-i18next': 'reactI18next',
          'react-router-dom': 'reactRouterDom',
        },
      },
      plugins: [],
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
    })
  ],
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
});
