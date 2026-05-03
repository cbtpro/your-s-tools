import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from 'react';
import { Empty, Result, Spin } from '@arco-design/web-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDrop } from 'react-dnd';
import { useTranslation } from '@your-s-tools/i18n';
import { initialSettings, useLayoutStorage, useStorageState } from '@your-s-tools/shared';
import type { YourToolApp } from '@your-s-tools/types';
import { useRouterGuard } from '@/routes/router-guard';
import { randomString } from '@/utils';
import { defaultSizeMap } from '@/constants/layout';
import EditBar from '@/components/edit-bar';
import './root.css';
import '../../assets/styles/styles.css';

const HoverDeleteButton = lazy(() => import('@/components/hover-delete-button'));
const ComponentSidebar = lazy(() => import('@/components/component-sidebar'));
const FloatingDrawer = lazy(() => import('@/components/floating-drawer'));
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

interface ComponentSlotProps {
  layout: ReactGridLayout.Layout;
  layoutJsonData: YourToolApp.LayoutJsonData[];
}

interface EditableLayoutItemProps {
  layout: ReactGridLayout.Layout;
  children: ReactNode;
  onDelete: (id: string) => void;
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

function LoadingPanel({ label }: { label: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full items-center justify-center">
      <Spin tip={t('common.loading')} />
      <span className="sr-only">{label}</span>
    </div>
  );
}

function EditableLayoutItem({ layout, children, onDelete }: EditableLayoutItemProps) {
  return (
    <div className="hover-group" style={{ position: 'relative', height: '100%' }}>
      <HoverDeleteButton onClick={() => onDelete(layout.i)} />
      {children}
    </div>
  );
}

function useLayoutEditMode() {
  const [layoutEdit, setLayoutEdit] = useStorageState<YourToolApp.Settings, 'layoutEdit'>(
    'layoutEdit',
    initialSettings.layoutEdit,
  );

  useEffect(() => {
    setLayoutEdit((prev) => ({ ...prev, isEditMode: true }));
    return () => {
      setLayoutEdit((prev) => ({ ...prev, isEditMode: false }));
    };
  }, [setLayoutEdit]);

  return layoutEdit;
}

function useUnsavedLayoutGuard(isDirty: boolean) {
  const { registerGuard } = useRouterGuard();

  useEffect(() => {
    return registerGuard((from, to) => (
      from === '/layout-edit' &&
      to !== '/layout-edit' &&
      isDirty
    ));
  }, [isDirty, registerGuard]);
}

function LayoutEdit() {
  const { t } = useTranslation();
  const layoutEdit = useLayoutEditMode();
  const [storedLayoutJsonData, setStoredLayoutJsonData] = useLayoutStorage();
  const [layoutJsonData, setLayoutJsonData] = useState<YourToolApp.LayoutJsonData[]>([]);
  const [layouts, setLayouts] = useState<ReactGridLayout.Layouts>(() => createLayouts([]));
  const [firstRender, setFirstRender] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useUnsavedLayoutGuard(isDirty);

  useEffect(() => {
    setLayoutJsonData(storedLayoutJsonData);
    setLayouts(createLayouts(storedLayoutJsonData));
    setIsDirty(false);
  }, [storedLayoutJsonData]);

  useEffect(() => {
    const timer = window.setTimeout(() => setFirstRender(false), 200);
    return () => window.clearTimeout(timer);
  }, []);

  const addComponent = useCallback((type: string) => {
    const newId = randomString();
    const size = defaultSizeMap[type] || { w: 4, h: 2 };

    setIsDirty(true);
    setLayoutJsonData((prev) => [...prev, { id: newId, component: type }]);
    setLayouts((prev) => ({
      ...prev,
      lg: [
        ...(prev.lg || []),
        {
          ...size,
          w: Math.min(size.w, GRID_COLUMNS.lg),
          x: 0,
          y: Infinity,
          i: newId,
          static: false,
        },
      ],
    }));
  }, []);

  const [, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: { type: string }) => addComponent(item.type),
  }), [addComponent]);

  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef.current);
    }
  }, [drop]);

  const handleLayoutChange = useCallback(
    (_currentLayout: ReactGridLayout.Layout[], allLayouts: ReactGridLayout.Layouts) => {
      setLayouts(allLayouts);
      setIsDirty(true);
    },
    [],
  );

  const handleDelete = useCallback((deleteTarget: string) => {
    setIsDirty(true);
    setLayoutJsonData((prev) => prev.filter((item) => item.id !== deleteTarget));
    setLayouts((prev) => ({
      ...prev,
      lg: (prev.lg || []).filter((layout) => layout.i !== deleteTarget),
    }));
  }, []);

  const handleCancelEdit = useCallback(() => {
    setLayoutJsonData(storedLayoutJsonData);
    setLayouts(createLayouts(storedLayoutJsonData));
    setIsDirty(false);
  }, [storedLayoutJsonData]);

  const handleSaveEdit = useCallback(() => {
    setStoredLayoutJsonData(layoutJsonData);
    setIsDirty(false);
  }, [layoutJsonData, setStoredLayoutJsonData]);

  const gridItems = useMemo(
    () => (layouts.lg || []).map((layout) => (
      <div key={layout.i} className={layout.static ? 'static' : ''}>
        <EditableLayoutItem layout={layout} onDelete={handleDelete}>
          <ComponentSlot layout={layout} layoutJsonData={layoutJsonData} />
        </EditableLayoutItem>
      </div>
    )),
    [handleDelete, layoutJsonData, layouts.lg],
  );

  const renderEditorTools = () => {
    if (!layoutEdit.isEditMode) return null;

    return (
      <>
        <Suspense fallback={<LoadingPanel label={t('layout.editor')} />}>
          <EditBar onCancelEdit={handleCancelEdit} onSaveEdit={handleSaveEdit} />
        </Suspense>
        <FloatingDrawer title={t('components.components')} width="auto">
          <Suspense fallback={<LoadingPanel label={t('components.components')} />}>
            <ComponentSidebar />
          </Suspense>
        </FloatingDrawer>
      </>
    );
  };

  return (
    <>
      {renderEditorTools()}
      <div style={{ display: 'flex', height: '100vh' }}>
        <div ref={dropRef} style={{ flex: 1, background: '#f8f9fa' }} className="layout-container">
          <ResponsiveReactGridLayout
            layouts={layouts}
            onLayoutChange={handleLayoutChange}
            measureBeforeMount={false}
            compactType={COMPACT_TYPE}
            preventCollision={!COMPACT_TYPE}
            isDraggable={layoutEdit.isEditMode}
            isResizable={layoutEdit.isEditMode}
            cols={GRID_COLUMNS}
            rowHeight={85}
            draggableCancel=".hover-delete-btn"
            style={{ visibility: firstRender ? 'hidden' : 'visible' }}
          >
            {gridItems}
          </ResponsiveReactGridLayout>
        </div>
      </div>
    </>
  );
}

export default LayoutEdit;
