import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { MESSAGE_TYPE, useLayoutStorage } from '@your-s-tools/shared';
import {
  ComponentSlot,
  createLayouts,
  layoutCompactType,
  layoutGridColumns,
  LayoutItem,
} from './layout-renderer';
import './root.css';
import '../../assets/styles/styles.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface LayoutProps {
  children?: ReactNode;
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
          compactType={layoutCompactType}
          preventCollision={!layoutCompactType}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          cols={layoutGridColumns}
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
