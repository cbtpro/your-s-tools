import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Spin } from '@arco-design/web-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDrop } from 'react-dnd';
import { useTranslation } from '@your-s-tools/i18n';
import { initialSettings, useLayoutStorage, useStorageState } from '@your-s-tools/shared';
import type { YourToolApp } from '@your-s-tools/types';
import { useRouterGuard } from '@/routes/router-guard';
import { randomString } from '@/utils';
import { getComponentSize } from '@/constants/components';
import EditBar from '@/components/edit-bar';
import {
  ComponentSlot,
  createLayouts,
  layoutCompactType,
  layoutGridColumns,
  LayoutItem,
} from './layout-renderer';
import './root.css';
import '../../assets/styles/styles.css';

const HoverDeleteButton = lazy(() => import('@/components/hover-delete-button'));
const ComponentSidebar = lazy(() => import('@/components/component-sidebar'));
const FloatingDrawer = lazy(() => import('@/components/floating-drawer'));

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface EditableLayoutItemProps {
  layout: ReactGridLayout.Layout;
  children: ReactNode;
  onDelete: (id: string) => void;
}

interface LayoutSnapshotItem {
  id: string;
  component: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

function createLayoutSnapshot(
  layoutJsonData: YourToolApp.LayoutJsonData[],
  layouts: ReactGridLayout.Layout[],
) {
  return layoutJsonData
    .map<LayoutSnapshotItem>((item) => {
      const layout = layouts.find((entry) => entry.i === item.id) ?? item.layout;
      const size = getComponentSize(item.component);

      return {
        id: item.id,
        component: item.component,
        x: layout?.x ?? 0,
        y: layout?.y ?? 0,
        w: layout?.w ?? size.w,
        h: layout?.h ?? size.h,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function areLayoutSnapshotsEqual(
  left: LayoutSnapshotItem[],
  right: LayoutSnapshotItem[],
) {
  if (left.length !== right.length) return false;

  return left.every((item, index) => {
    const next = right[index];
    return next &&
      item.id === next.id &&
      item.component === next.component &&
      item.x === next.x &&
      item.y === next.y &&
      item.w === next.w &&
      item.h === next.h;
  });
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
    <LayoutItem interactionDisabled>
      <HoverDeleteButton onClick={() => onDelete(layout.i)} />
      {children}
    </LayoutItem>
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
  const [componentsDrawerVisible, setComponentsDrawerVisible] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const baselineSnapshotRef = useRef<LayoutSnapshotItem[]>([]);
  const gridSyncedRef = useRef(false);

  useUnsavedLayoutGuard(isDirty);

  // 组件挂载时确保 isDirty 为 false
  useEffect(() => {
    setIsDirty(false);

  }, []);

  useEffect(() => {
    const nextLayouts = createLayouts(storedLayoutJsonData);
    setLayoutJsonData(storedLayoutJsonData);
    setLayouts(nextLayouts);
    baselineSnapshotRef.current = createLayoutSnapshot(storedLayoutJsonData, nextLayouts.lg || []);
    gridSyncedRef.current = false;
    // 数据加载完成后再次确保重置状态
    setIsDirty(false);

  }, [storedLayoutJsonData]);


  useEffect(() => {
    const timer = window.setTimeout(() => setFirstRender(false), 200);
    return () => window.clearTimeout(timer);
  }, []);

  const addComponent = useCallback((type: string) => {
    const newId = randomString();
    const size = getComponentSize(type);


    setIsDirty(true);
    setLayoutJsonData((prev) => [...prev, { id: newId, component: type }]);
    setLayouts((prev) => ({
      ...prev,
      lg: [
        ...(prev.lg || []),
        {
          ...size,
          w: Math.min(size.w, layoutGridColumns.lg),
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

      const nextLayout = allLayouts.lg || [];
      const nextSnapshot = createLayoutSnapshot(layoutJsonData, nextLayout);

      if (!gridSyncedRef.current) {
        baselineSnapshotRef.current = nextSnapshot;
        gridSyncedRef.current = true;
        setIsDirty(false);
        return;
      }

      setIsDirty(!areLayoutSnapshotsEqual(baselineSnapshotRef.current, nextSnapshot));
    },
    [layoutJsonData],
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
    const nextLayouts = createLayouts(storedLayoutJsonData);
    setLayoutJsonData(storedLayoutJsonData);
    setLayouts(nextLayouts);
    baselineSnapshotRef.current = createLayoutSnapshot(storedLayoutJsonData, nextLayouts.lg || []);
    gridSyncedRef.current = false;
    setIsDirty(false);
  }, [storedLayoutJsonData]);

  const handleSaveEdit = useCallback(() => {
    // 保存布局数据时，同时保存位置信息
    const layoutDataWithPosition = layoutJsonData.map(item => {
      const layoutItem = layouts.lg?.find(l => l.i === item.id);
      return {
        ...item,
        layout: layoutItem ? {
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        } : undefined,
      };
    });

    setStoredLayoutJsonData(layoutDataWithPosition);
    baselineSnapshotRef.current = createLayoutSnapshot(layoutDataWithPosition, layouts.lg || []);
    gridSyncedRef.current = true;
    setIsDirty(false);
  }, [layoutJsonData, layouts.lg, setStoredLayoutJsonData]);

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
          <EditBar
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onOpenComponents={() => setComponentsDrawerVisible(true)}
            isDirty={isDirty}
          />
        </Suspense>
        <FloatingDrawer
          title={t('components.components')}
          width="auto"
          visible={componentsDrawerVisible}
          onClose={() => setComponentsDrawerVisible(false)}
        >
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
            compactType={layoutCompactType}
            preventCollision={!layoutCompactType}
            isDraggable={layoutEdit.isEditMode}
            isResizable={layoutEdit.isEditMode}
            cols={layoutGridColumns}
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
