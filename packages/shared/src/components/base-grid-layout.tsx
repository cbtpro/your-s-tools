import { Suspense, type ReactNode } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Spin, Empty, Result } from '@arco-design/web-react';
import type { YourToolApp } from "@your-s-tools/types";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface BaseGridLayoutProps {
  layouts: ReactGridLayout.Layouts;
  layoutJsonData: YourToolApp.LayoutJsonData[];
  componentMap: Record<string, any>;
  isEditMode: boolean;
  onLayoutChange?: (current: any, all: ReactGridLayout.Layouts) => void;
  extraWrapper?: (id: string, children: ReactNode) => ReactNode;
  children?: ReactNode;
}

export function BaseGridLayout({
  layouts,
  layoutJsonData,
  componentMap,
  isEditMode,
  onLayoutChange,
  extraWrapper,
  children
}: BaseGridLayoutProps) {

  // 渲染单个组件逻辑
  const renderItem = (l: ReactGridLayout.Layout) => {
    const item = layoutJsonData.find((x) => x.id === l.i);

    if (!item) return <Empty description="配置丢失" />;

    const Comp = componentMap[item.component];
    if (!Comp) return <Result status='404' title='组件未注册' />;

    const content = (
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Spin tip={`正在加载 ${item.component}...`} />
        </div>
      }>
        <Comp />
      </Suspense>
    );

    // 如果传入了包装器（如编辑页的删除按钮），则包裹，否则直接返回
    return extraWrapper ? extraWrapper(l.i, content) : content;
  };

  return (
    <div className="layout-root" style={{ display: 'flex', height: '100vh', width: '100%' }}>
      {children}
      <div style={{ flex: 1, background: "var(--color-fill-1)", overflowY: 'auto' }}>
        <ResponsiveReactGridLayout
          layouts={layouts}
          onLayoutChange={onLayoutChange}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          // 适配 Arco 的响应式栅格
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={85}
          draggableCancel=".arco-btn, .no-drag" // 排除掉 Arco 按钮触发拖拽
          measureBeforeMount={false}
        >
          {(layouts.lg || []).map((l) => (
            <div key={l.i} style={{ backgroundColor: 'var(--color-bg-2)', borderRadius: '4px' }}>
               {renderItem(l)}
            </div>
          ))}
        </ResponsiveReactGridLayout>
      </div>
    </div>
  );
}
