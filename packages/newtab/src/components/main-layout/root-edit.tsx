import { lazy, Suspense, useEffect, useRef, useState, type JSX } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useTranslation } from 'react-i18next';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { YourToolApp } from "@your-s-tools/types";
import { useStableResponsiveLayout } from './hooks/use-stable-grid-layout';
import { MESSAGE_TYPE, useLayoutStorage } from '@your-s-tools/shared';
import './root.css';
import '../../assets/styles/styles.css';
import { randomString } from '@/utils';
import { defaultSizeMap } from '@/constants/layout';

const HoverDeleteButton = lazy(() => import('@/components/hover-delete-button'));
const ComponentSidebar = lazy(() => import('@/components/component-sidebar'));
const AsyncBaseNavbar = lazy(() => import('@/components/base-nav-bar'));
const AsyncBaseSearchBar = lazy(() => import('@/components/base-search-bar'));
const AsyncBasePopular = lazy(() => import('@/components/base-popular'));
const AsyncBaseFavorite = lazy(() => import('@/components/base-favorite'));
const FloatingDrawer = lazy(() => import('@/components/floating-drawer'));

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// 组件映射表
const componentMap: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  BaseNavbar: AsyncBaseNavbar,
  BaseSearchBar: AsyncBaseSearchBar,
  BasePopular: AsyncBasePopular,
  BaseFavorite: AsyncBaseFavorite,
};

function Root() {
  const { t } = useTranslation();
  // const [isLoading, setIsLoading] = useState(false);
  /**
   * 编辑状态
   */
  const [isEditMode, setIsEditMode] = useState(true);
  const addToggleIsEditMode = (message: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    const { type, value = !isEditMode } = message;
    if (type === MESSAGE_TYPE.TOGGLE_EDIT) {
      setIsEditMode(value);
      sendResponse({ success: true })
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(addToggleIsEditMode);
    return () => {
      chrome.runtime.onMessage.removeListener(addToggleIsEditMode);
    };
  });
  const [_list, _setList] = useState<YourToolApp.BasePropertyEntity[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [_currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');
  const compactType = "vertical";
  const [mounted, setMounted] = useState(false);
  const [_LayoutJsonData, _setLayoutJsonData] = useLayoutStorage();

  const [layouts, setLayouts] = useState<ReactGridLayout.Layouts>({
    lg: [],
    sm: [],
  });

  const [layoutJson, setLayoutJson] = useState<YourToolApp.LayoutJsonData[]>([]);

  const { ready: _ready } = useStableResponsiveLayout(layouts, containerRef);

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  // 允许右侧接收拖拽
  const [, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: { type: string }) => {
      const newId = randomString();
      const newItem = { id: newId, component: item.type };
      setLayoutJson((prev) => [...prev, newItem]);
      const size = defaultSizeMap[item.type] || { w: 6, h: 2 };
      setLayouts((prev) => ({
        ...prev,
        lg: [
          ...(prev.lg || []),
          { ...size, x: 0, y: Infinity, i: newId, static: false },
        ],
      }));
    },
  }));

  const onLayoutChange = (_currentLayout: ReactGridLayout.Layout[], allLayouts: ReactGridLayout.Layouts) => {
    setLayouts(allLayouts);
  };

  const renderComponent = (layout: ReactGridLayout.Layout) => {
    const { i: id } = layout;
    const item = layoutJson.find((x) => x.id === id);
    if (!item) return <span>Unknown Component</span>;

    const Comp = componentMap[item.component];
    if (!Comp) return <span>Missing Component: {item.component}</span>;

    return (
      <Suspense fallback={<div>Loading {item.component}...</div>}>
        <Comp />
      </Suspense>
    );
  };

  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setFirstRender(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const onBreakpointChange = (newBreakpoint: string, _newCols: number) => {
    setCurrentBreakpoint(newBreakpoint);
  };

// 包装渲染的组件，增加 hover & 删除按钮
const renderWithWrapper = (layout: ReactGridLayout.Layout) => {
  const { i: id } = layout;
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
      }}
      className="hover-group"
    >
      {/* 删除按钮 */}
      <HoverDeleteButton onClick={() => confirmDelete(id)} />

      {/* 真实组件 */}
      {renderComponent(layout)}
    </div>
  );
};
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      drop(divRef.current);
    }
  }, [drop]);

  const confirmDelete = (deleteTarget: string) => {
    setLayoutJson((prev) => prev.filter((item) => item.id !== deleteTarget));
    setLayouts((prev) => ({
      ...prev,
      lg: (prev.lg || []).filter((l) => l.i !== deleteTarget),
    }));
  };

  return (
    <>
      <FloatingDrawer title={t('components.components')} width={'auto'}>
        {/* 组件面板 */}
        <Suspense fallback={<div>Loading Sidebar...</div>}>
          <ComponentSidebar />
        </Suspense>
      </FloatingDrawer>
      <DndProvider backend={HTML5Backend}>
        <div style={{ display: 'flex', height: '100vh' }}>
          {/* 右侧布局区 */}
          <div ref={divRef} style={{ flex: 1, background: "#f8f9fa" }} className="layout-container">
            <ResponsiveReactGridLayout
              layouts={layouts}
              onLayoutChange={onLayoutChange}
              onBreakpointChange={onBreakpointChange}
              measureBeforeMount={false}
              useCSSTransforms={mounted}
              compactType={compactType}
              preventCollision={!compactType}
              isDraggable={isEditMode}
              isResizable={isEditMode}
              cols={{ lg: 2, md: 2, sm: 2, xs: 2, xxs: 2 }}
              rowHeight={85}
              draggableCancel=".hover-delete-btn"
              style={{ visibility: firstRender ? 'hidden' : 'visible' }}
            >
              {(layouts.lg || []).map((l) => (
                <div key={l.i} className={l.static ? 'static' : ''}>
                  {renderWithWrapper(l)}
                </div>
              ))}
            </ResponsiveReactGridLayout>
          </div>
        </div>
      </DndProvider>
    </>
  );
}

export default Root;
