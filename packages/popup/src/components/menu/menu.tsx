import React from 'react';
import { useTranslation } from 'react-i18next';
import './menu.css';
import { MESSAGE_TYPE } from '@your-s-tools/shared';
import MenuFooter from './menu-footer';
interface MenuProps {
  appName: string;
  version: string;
}

interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

const Menu: React.FC<MenuProps> = ({ appName, version }) => {
  const { t } = useTranslation();
  const menuItems: MenuItem[] = [
    { label: t('apps.settings'), path: '/settings', icon: '⚙️' },
    { label: t('apps.customize'), path: '/layout-edit', icon: '🎨' },
    { label: t('apps.help'), path: '/help', icon: '❓' },
    { label: t('apps.about'), path: '/about', icon: 'ℹ️' },
  ];

  const handleNavigate = async (path: string) => {
    const response = await chrome.runtime.sendMessage(
      {
        type: MESSAGE_TYPE.NAVIGATION,
        payload: { path },
      }
    );
    console.log('newtab response:', response);
    window.close();
  };

  return (
    <div className="menu-container">
      {/* 顶部：软件信息 */}
      <div className="menu-header">
        <h2>{appName}</h2>
        <span className="version">v{version}</span>
      </div>

      {/* 中间：菜单项 */}
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.path} onClick={() => handleNavigate(item.path)}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </li>
        ))}
      </ul>

      {/* 底部：图标栏 */}
      <div className="menu-footer">
        <MenuFooter />
      </div>
    </div>
  );
};

export default Menu;
