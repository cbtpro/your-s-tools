import { lazy, Suspense, useEffect, useRef, useState, type JSX } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
// import { useTranslation } from 'react-i18next';
import type { YourToolApp } from "@your-s-tools/types";
import { useStableResponsiveLayout } from './hooks/use-stable-grid-layout';
import { MESSAGE_TYPE, useLayoutStorage } from '@your-s-tools/shared';
import './root.css';
import '../../assets/styles/styles.css';

const AsyncBaseNavbar = lazy(() => import('@/components/base-nav-bar'));
const AsyncBaseSearchBar = lazy(() => import('@/components/base-search-bar'));
const AsyncBasePopular = lazy(() => import('@/components/base-popular'));
const AsyncBaseFavorite = lazy(() => import('@/components/base-favorite'));

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// 组件映射表
const componentMap: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  BaseNavbar: AsyncBaseNavbar,
  BaseSearchBar: AsyncBaseSearchBar,
  BasePopular: AsyncBasePopular,
  BaseFavorite: AsyncBaseFavorite,
};

function Root() {
  // const { t } = useTranslation();
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

  const [layoutJson, ] = useState<YourToolApp.LayoutJsonData[]>([]);

  const { ready: _ready } = useStableResponsiveLayout(layouts, containerRef);

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

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

  // 包装渲染的组件
  const renderWithWrapper = (layout: ReactGridLayout.Layout) => {
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
        }}
        className="hover-group"
      >
        {/* 真实组件 */}
        {renderComponent(layout)}
      </div>
    );
  };
  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
          {/* 右侧布局区 */}
          <div style={{ flex: 1, background: "#f8f9fa" }} className="layout-container">
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
    </>
  );
}

export default Root;
