import React from 'react';
import './menu.css';

interface MenuProps {
  appName: string;
  version: string;
}

interface MenuItem {
  label: string;
  path: string;
}

const Menu: React.FC<MenuProps> = ({ appName, version }) => {
  const menuItems: MenuItem[] = [
    { label: '设置', path: '/settings' },
    { label: '个性化', path: '/customize' },
    { label: '帮助', path: '/help' },
    { label: '关于', path: '/about' },
  ];

  const handleNavigate = (path: string) => {
    console.log('跳转到:', path);
    // 这里可以换成 react-router 的 navigate(path)
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
            {item.label}
          </li>
        ))}
      </ul>

      {/* 底部：图标栏 */}
      <div className="menu-footer">
        <a
          href="https://github.com/your-repo"
          target="_blank"
          rel="noreferrer"
          title="GitHub"
        >
          🐙
        </a>
        <a
          href="https://juejin.cn/user/your-id"
          target="_blank"
          rel="noreferrer"
          title="掘金"
        >
          📘
        </a>
        <a
          href="https://github.com/your-repo/issues"
          target="_blank"
          rel="noreferrer"
          title="Issue"
        >
          ❗
        </a>
      </div>
    </div>
  );
};

export default Menu;
