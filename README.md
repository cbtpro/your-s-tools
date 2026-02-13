# your-s-tools

## 开发

```bash

# 安装依赖
pnpm install

# 替换所有子类的依赖版本为父包的版本
pnpm catalog

# 构建所有子包，监听文件变化并自动重建
pnpm run build:watch

# 也可以使用turbo构建所有子包，监听文件变化并自动重建（推荐）
pnpm run build:watch:turbo

# 也可以分别构建每个子包，监听文件变化并自动重建，在只需要修改某个包时，只需要进入该包目录运行构建命令即可，但依然要注意修改了子包，受影响的包也要重新构建

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
