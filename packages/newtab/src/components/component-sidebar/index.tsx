import React, { useRef, useState, useEffect, } from 'react';
import { useDrag } from 'react-dnd';
import {
  IconCommon,
  IconApps,
  IconSearch,
  IconPlusCircle,
  IconMinusCircle,
} from '@arco-design/web-react/icon';
import { useCompositionInput } from '@your-s-tools/shared';
import { iconMap, componentList, type ComponentItem } from '@/constants/components';
import styles from './style.module.scss';

const DraggableComponent: React.FC<{
  type: string;
  label: string;
  icon?: React.ReactNode;
}> = ({ type, label, icon }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (itemRef.current) drag(itemRef.current);
  }, [drag]);
  const style1s: React.CSSProperties = { fontSize: 20, marginBottom: 6 };
  const style2s: React.CSSProperties = { fontSize: 12 };
  return (
    <div
      ref={itemRef}
      className={[styles['sidebar-item'], isDragging ? styles['is-dragging'] : ''].join(' ')}
    >
      <div style={style1s}>{icon}</div>
      <span style={style2s}>{label}</span>
    </div>
  );
};

// ---------- 组件面板 ----------
const ComponentSidebar: React.FC<{
  components?: ComponentItem[]; // 可传入自定义列表
}> = ({ components = componentList }) => {
  const { value: search, bind: bindSearch } = useCompositionInput('');


  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const groups = Array.from(new Set(components.map(c => c.group)));

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <aside
      style={{
        width: 280,
        background: '#fff',
        height: '100%',
        overflowY: 'auto',
        padding: 16,
      }}
    >
      {/* 面板标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <IconApps style={{ marginRight: 8 }} />
        <span style={{ fontWeight: 600 }}>组件面板</span>
      </div>

      {/* 搜索框 */}
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
        <IconSearch style={{ marginRight: 4 }} />
        <input
          // ref={inputRef}
          // defaultValue={search}
          // onInput={handleInput}
          // onCompositionStart={handleCompositionStart}
          // onCompositionEnd={handleCompositionEnd}
          {...bindSearch}
          type="text"
          placeholder="搜索组件..."
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #ddd',
          }}
        />
      </div>

      {/* 分组列表 */}
      {groups.map(group => {
        const filtered = components.filter(
          c => c.group === group && c.label.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length === 0) return null;

        return (
          <div key={group} style={{ marginBottom: 16 }}>
            {/* 分组标题 */}
            <div
              style={{
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 6,
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => toggleGroup(group)}
            >
              <span>{group}</span>
              <span style={{ marginLeft: 6 }}>
                {collapsedGroups[group] ? <IconPlusCircle /> : <IconMinusCircle />}
              </span>
            </div>

            {/* 分组内容，网格布局 */}
            {!collapsedGroups[group] && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: 12,
                }}
              >
                {filtered.map(c => {
                  return  <DraggableComponent
                    key={c.type}
                    type={c.type}
                    label={c.label}
                    icon={c.icon ? iconMap[c.icon] : <IconCommon />}
                  />;
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default ComponentSidebar;
