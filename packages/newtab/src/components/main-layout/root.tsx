import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from 'react';
import { Empty, Result, Spin } from '@arco-design/web-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useTranslation } from '@your-s-tools/i18n';
import { MESSAGE_TYPE, useLayoutStorage } from '@your-s-tools/shared';
import type { YourToolApp } from '@your-s-tools/types';
import { defaultSizeMap } from '@/constants/layout';
import './root.css';
import '../../assets/styles/styles.css';

const AsyncBaseNavbar = lazy(() => import('@/components/base-nav-bar'));
const AsyncBaseSearchBar = lazy(() => import('@/components/base-search-bar'));
const AsyncBasePopular = lazy(() => import('@/components/base-popular'));
const AsyncBaseFavorite = lazy(() => import('@/components/base-favorite'));

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const GRID_COLUMNS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const COMPACT_TYPE: 'vertical' | 'horizontal' | null = 'vertical';
const componentMap: Record<string, LazyExoticComponent<ComponentType>> = {
  BaseNavbar: AsyncBaseNavbar,
  BaseSearchBar: AsyncBaseSearchBar,
  BasePopular: AsyncBasePopular,
  BaseFavorite: AsyncBaseFavorite,
};

interface LayoutProps {
  children?: ReactNode;
}

interface ComponentSlotProps {
  layout: ReactGridLayout.Layout;
  layoutJsonData: YourToolApp.LayoutJsonData[];
}

function createLayouts(layoutJsonData: YourToolApp.LayoutJsonData[]): ReactGridLayout.Layouts {
  const lg = layoutJsonData.map((item, index) => {
    const size = defaultSizeMap[item.component] || { w: 4, h: 2 };

    return {
      i: item.id,
      x: 0,
      y: index * size.h,
      w: Math.min(size.w, GRID_COLUMNS.lg),
      h: size.h,
      static: false,
    };
  });

  return {
    lg,
    md: lg.map((item) => ({ ...item, w: Math.min(item.w, GRID_COLUMNS.md) })),
    sm: lg.map((item) => ({ ...item, w: Math.min(item.w, GRID_COLUMNS.sm) })),
    xs: lg.map((item) => ({ ...item, w: Math.min(item.w, GRID_COLUMNS.xs) })),
    xxs: lg.map((item) => ({ ...item, w: Math.min(item.w, GRID_COLUMNS.xxs) })),
  };
}

function useEditModeMessage() {
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const toggleEditMode = (
      message: { type?: string; value?: boolean },
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response?: { success: boolean }) => void,
    ) => {
      if (message.type !== MESSAGE_TYPE.TOGGLE_EDIT) return false;

      setIsEditMode((prev) => message.value ?? !prev);
      sendResponse({ success: true });
      return false;
    };

    chrome.runtime.onMessage.addListener(toggleEditMode);
    return () => {
      chrome.runtime.onMessage.removeListener(toggleEditMode);
    };
  }, []);

  return isEditMode;
}

function LoadingComponent({ component }: { component: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full items-center justify-center">
      <Spin tip={t('layout.loadingComponent', { component })} />
    </div>
  );
}

function ComponentSlot({ layout, layoutJsonData }: ComponentSlotProps) {
  const { t } = useTranslation();
  const item = layoutJsonData.find((entry) => entry.id === layout.i);

  if (!item) {
    return <Empty description={t('layout.missingConfig')} />;
  }

  const Component = componentMap[item.component];
  if (!Component) {
    return <Result status="404" title={t('layout.unregisteredComponent', { component: item.component })} />;
  }

  return (
    <Suspense fallback={<LoadingComponent component={item.component} />}>
      <Component />
    </Suspense>
  );
}

function LayoutItem({ children }: { children: ReactNode }) {
  return (
    <div className="hover-group" style={{ position: 'relative', height: '100%' }}>
      {children}
    </div>
  );
}

function Layout({ children }: LayoutProps) {
  const isEditMode = useEditModeMessage();
  const [firstRender, setFirstRender] = useState(true);
  const [layoutJsonData] = useLayoutStorage();
  const [layouts, setLayouts] = useState<ReactGridLayout.Layouts>(() => createLayouts([]));

  useEffect(() => {
    setLayouts(createLayouts(layoutJsonData));
  }, [layoutJsonData]);

  useEffect(() => {
    const timer = window.setTimeout(() => setFirstRender(false), 200);
    return () => window.clearTimeout(timer);
  }, []);

  const handleLayoutChange = useCallback(
    (_currentLayout: ReactGridLayout.Layout[], allLayouts: ReactGridLayout.Layouts) => {
      setLayouts(allLayouts);
    },
    [],
  );

  const gridItems = useMemo(
    () => (layouts.lg || []).map((layout) => (
      <div key={layout.i} className={layout.static ? 'static' : ''}>
        <LayoutItem>
          <ComponentSlot layout={layout} layoutJsonData={layoutJsonData} />
        </LayoutItem>
      </div>
    )),
    [layoutJsonData, layouts.lg],
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {children}
      <div style={{ flex: 1, background: '#f8f9fa' }} className="layout-container">
        <ResponsiveReactGridLayout
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          measureBeforeMount={false}
          compactType={COMPACT_TYPE}
          preventCollision={!COMPACT_TYPE}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          cols={GRID_COLUMNS}
          rowHeight={85}
          draggableCancel=".hover-delete-btn"
          style={{ visibility: firstRender ? 'hidden' : 'visible' }}
        >
          {gridItems}
        </ResponsiveReactGridLayout>
      </div>
    </div>
  );
}

export default Layout;
