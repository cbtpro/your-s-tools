import React, { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { Menu, Button, } from '@arco-design/web-react';
import {
  IconMenuFold,
  IconMenuUnfold,
  IconApps,
  IconEdit,
} from '@arco-design/web-react/icon';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const ButtonGroup = Button.Group;

interface SidebarItemProps {
  type: string;
  label: string;
}

/**
 * 可拖拽的 MenuItem
 */
const DraggableMenuItem: React.FC<SidebarItemProps> = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const itemRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (itemRef.current) {
      drag(itemRef.current);
    }
  }, [drag]);

  return (
    <div ref={itemRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {label}
    </div>
  );
};

/**
 * Sidebar 组件
 */
export const ComponentSidebar: React.FC = () => {
  const [collapse, setCollapse] = useState(false);

  const components = [
    { type: 'BaseNavbar', label: '导航栏' },
    { type: 'BaseSearchBar', label: '搜索框' },
    { type: 'BasePopular', label: '热门推荐' },
    { type: 'BaseFavorite', label: '收藏夹' },
  ];

  return (
    <aside
      style={{
        width: collapse ? 60 : 220,
        borderRight: '1px solid #ddd',
        background: '#fff',
        padding: '8px',
      }}
    >
      <Button
        type="primary"
        onClick={() => setCollapse(!collapse)}
      >
        {collapse ? <IconMenuUnfold /> : <IconMenuFold />}
      </Button>
      <Menu
        style={{ width: '100%', marginTop: 30, borderRadius: 4 }}
        theme="light"
        collapse={collapse}
        defaultOpenKeys={['components']}
      >
        <SubMenu
          key="components"
          title={
            <>
              <IconApps /> 组件面板
            </>
          }
        >
          {components.map((comp) => (
            <MenuItem key={comp.type}>
              <DraggableMenuItem type={comp.type} label={comp.label} />
            </MenuItem>
          ))}

      <ButtonGroup>
        <IconEdit />
      </ButtonGroup>
        </SubMenu>
      </Menu>
    </aside>
  );
};

export default ComponentSidebar;
