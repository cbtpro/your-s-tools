import React, { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';

interface SidebarItemProps {
  type: string;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      drag(divRef.current);
    }
  }, [drag]);
  return (
    <div
      ref={divRef}
      style={{
        padding: '8px 12px',
        margin: '6px 0',
        background: isDragging ? '#cce5ff' : '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'grab',
      }}
    >
      {label}
    </div>
  );
};

export const ComponentSidebar: React.FC = () => {
  const components = [
    { type: 'BaseNavbar', label: '导航栏' },
    { type: 'BaseSearchBar', label: '搜索框' },
    { type: 'BasePopular', label: '热门推荐' },
    { type: 'BaseFavorite', label: '收藏夹' },
  ];

  return (
    <aside
      style={{
        width: '220px',
        height: '100vh',
        borderRight: '1px solid #ddd',
        padding: '16px',
        background: '#fff',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: '12px' }}>组件面板</h3>
      {components.map((comp) => (
        <SidebarItem key={comp.type} type={comp.type} label={comp.label} />
      ))}
    </aside>
  );
};

export default ComponentSidebar;
