import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@your-s-tools/shared',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    // lib: {
    //   entry: {
    //     index: path.resolve(__dirname, "src/index.ts"),
    //     utils: path.resolve(__dirname, "src/utils/index.ts"),
    //     hooks: path.resolve(__dirname, "src/hooks/index.ts"),
    //   },
    //   name: "@your-s-tools/shared",
    //   fileName: (format, entryName) => `${entryName}.${format}.js`,
    //   formats: ["es", "cjs"],
    // },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
      plugins: [],
    },
  },
  plugins: [dts()],
});
