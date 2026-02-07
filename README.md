# your-s-tools

## 开发

```bash
pnpm install

cd packages/shared
pnpm run build:watch

cd packages/newtab
pnpm run build:watch

cd packages/popup
pnpm run build:watch

cd packages/options
pnpm run build:watch

cd packages/chrome
pnpm run build:watch
```

## 添加依赖

pnpm add -D sass-embedded classnames

pnpm catalog
如果你已经在 pnpm-workspace.yaml 中配置了工作区，可以直接在终端运行：

```sh
pnpm add @your-s-tools/types --filter <你的目标子包名> --workspace
```

或者进入目标子包所在的目录直接运行：

```sh
cd packages/target-app
pnpm add @your-s-tools/types --workspace
```

## TODO

- 图片预览 [react-phone-view](https://github.com/MinJieLiu/react-photo-view)
- 时钟
  - 翻页时钟
