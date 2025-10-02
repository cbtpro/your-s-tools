import { useNavigate } from 'react-router-dom';
import { version } from '@your-s-tools/shared';

export default function About() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/', { replace: true }); // replace 避免产生历史记录
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>关于</h2>
      </header>

      <main style={styles.main}>
        <p style={styles.version}>
          当前版本号：<strong>{version}</strong>
        </p>
        <p style={styles.desc}>
          这是 <code>your-s-tools</code> 应用的关于页面，你可以在这里查看版本信息。
        </p>
      </main>

      <footer style={styles.footer}>
        <button style={styles.button} onClick={handleNavigation}>
          关闭
        </button>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    borderBottom: '1px solid #eee',
    marginBottom: '16px',
    paddingBottom: '8px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
  },
  main: {
    marginBottom: '16px',
  },
  version: {
    fontSize: '16px',
    marginBottom: '8px',
  },
  desc: {
    fontSize: '14px',
    color: '#555',
  },
  footer: {
    textAlign: 'right',
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};
