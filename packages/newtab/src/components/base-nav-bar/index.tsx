import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const BaseNavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false); // 移动端收起菜单
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo / 标题 */}
        <div style={styles.logo} onClick={() => handleNavigate('/')}>
          你的工具
        </div>

        {/* 桌面端菜单 */}
        <div style={styles.menuDesktop}>
          <button style={styles.menuItem} onClick={() => handleNavigate('/')}>
            首页
          </button>
          <button style={styles.menuItem} onClick={() => handleNavigate('/favorites')}>
            收藏
          </button>
          <button style={styles.menuItem} onClick={() => handleNavigate('/settings')}>
            设置
          </button>
          <button style={styles.menuItem} onClick={() => handleNavigate('/about')}>
            关于
          </button>
        </div>

        {/* 移动端菜单按钮 */}
        <div style={styles.menuMobile}>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X style={styles.icon} /> : <Menu style={styles.icon} />}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownList}>
            <button style={styles.dropdownItem} onClick={() => handleNavigate('/')}>
              首页
            </button>
            <button style={styles.dropdownItem} onClick={() => handleNavigate('/favorites')}>
              收藏
            </button>
            <button style={styles.dropdownItem} onClick={() => handleNavigate('/settings')}>
              设置
            </button>
            <button style={styles.dropdownItem} onClick={() => handleNavigate('/about')}>
              关于
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    width: '100%',
    background: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2563eb',
    cursor: 'pointer',
  },
  menuDesktop: {
    display: 'flex',
    gap: '24px',
  },
  menuItem: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#333',
  },
  menuMobile: {
    display: 'none',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  dropdown: {
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  dropdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
  },
  dropdownItem: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    textAlign: 'left',
    color: '#333',
  },
};

export default BaseNavBar;
