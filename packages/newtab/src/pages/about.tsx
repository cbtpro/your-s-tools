import { useNavigate } from 'react-router-dom';
import { version } from '@your-s-tools/shared';

export default function About() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/');
  };
  return (
    <div>
      <h2>关于</h2>
      <p>版本号: {version}</p>
      <button onClick={handleNavigation}>关闭</button>
    </div>
  );
}
