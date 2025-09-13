import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Settings Page</h2>
      <button onClick={handleNavigation}>关闭</button>
    </div>
  );
}
