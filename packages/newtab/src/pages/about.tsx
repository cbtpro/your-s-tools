import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/');
  };
  return (
    <div>
      <h2>关于</h2>
      <button onClick={handleNavigation}>关闭</button>
    </div>
  );
}
