import React, { useRef, useState, useEffect, type ChangeEvent, type CompositionEventHandler } from 'react';
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

// ---------- 可拖拽组件 ----------
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

  return (
    <div
      ref={itemRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: 12,
        borderRadius: 6,
        cursor: 'grab',
        background: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <span style={{ fontSize: 12 }}>{label}</span>
    </div>
  );
};

// ---------- 组件面板 ----------
const ComponentSidebar: React.FC<{
  components?: ComponentItem[]; // 可传入自定义列表
}> = ({ components = componentList }) => {
  // const [search, setSearch] = useState('');
  // const inputRef = useRef<HTMLInputElement>(null);
  // const isComposing = useRef(false);

  // const handleCompositionStart = () => {
  //   isComposing.current = true;
  // };

  // const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
  //   isComposing.current = false;
  //   setSearch(e.currentTarget.value);
  // };

  // const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
  //   // 不在组合中时更新
  //   if (!isComposing.current) {
  //     setSearch(e.currentTarget.value);
  //   }
  // };
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
