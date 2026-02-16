# your-s-tools

## 开发

```bash

# 安装依赖
pnpm install

# 替换所有子类的依赖版本为父包的版本
pnpm catalog

# 开发模式，会自动检测文件变化，自动编译
pnpm run dev

# 编译模式
pnpm run build

```

## 产物

开发模式时将 paskages/chrome 导入 chrome 的插件中。每次变化，需要手动刷新页面。

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
