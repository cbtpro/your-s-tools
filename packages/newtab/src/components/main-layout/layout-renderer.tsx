import { Suspense, type ReactNode } from 'react';
import { Empty, Result, Spin } from '@arco-design/web-react';
import { useTranslation } from '@your-s-tools/i18n';
import type { YourToolApp } from '@your-s-tools/types';
import { getComponentRenderer, getComponentSize } from '@/constants/components';

export const layoutGridColumns = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
export const layoutCompactType: 'vertical' | 'horizontal' | null = 'vertical';

interface ComponentSlotProps {
  layout: ReactGridLayout.Layout;
  layoutJsonData: YourToolApp.LayoutJsonData[];
}

export function createLayouts(layoutJsonData: YourToolApp.LayoutJsonData[]): ReactGridLayout.Layouts {
  const lg = layoutJsonData.map((item, index) => {
    const size = getComponentSize(item.component);

    // 如果有保存的布局信息，使用它；否则使用默认位置
    if (item.layout) {
      return {
        i: item.id,
        x: item.layout.x,
        y: item.layout.y,
        w: Math.min(item.layout.w, layoutGridColumns.lg),
        h: item.layout.h,
        static: false,
      };
    }

    // 默认布局：垂直排列
    return {
      i: item.id,
      x: 0,
      y: index * size.h,
      w: Math.min(size.w, layoutGridColumns.lg),
      h: size.h,
      static: false,
    };
  });

  return {
    lg,
    md: lg.map((item) => ({ ...item, w: Math.min(item.w, layoutGridColumns.md) })),
    sm: lg.map((item) => ({ ...item, w: Math.min(item.w, layoutGridColumns.sm) })),
    xs: lg.map((item) => ({ ...item, w: Math.min(item.w, layoutGridColumns.xs) })),
    xxs: lg.map((item) => ({ ...item, w: Math.min(item.w, layoutGridColumns.xxs) })),
  };
}

function LoadingComponent({ component }: { component: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full items-center justify-center">
      <Spin tip={t('layout.loadingComponent', { component })} />
    </div>
  );
}

export function ComponentSlot({ layout, layoutJsonData }: ComponentSlotProps) {
  const { t } = useTranslation();
  const item = layoutJsonData.find((entry) => entry.id === layout.i);

  if (!item) {
    return <Empty description={t('layout.missingConfig')} />;
  }

  const Component = getComponentRenderer(item.component);
  if (!Component) {
    return <Result status="404" title={t('layout.unregisteredComponent', { component: item.component })} />;
  }

  return (
    <Suspense fallback={<LoadingComponent component={item.component} />}>
      <Component />
    </Suspense>
  );
}

export function LayoutItem({ children }: { children: ReactNode }) {
  return (
    <div className="hover-group" style={{ position: 'relative', height: '100%' }}>
      {children}
    </div>
  );
}
