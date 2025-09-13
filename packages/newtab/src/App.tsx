import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { MESSAGE_TYPE } from '@your-s-tools/shared';
import Home from './pages/home';
import About from './pages/about';
import Settings from './pages/settings';

import './App.css'

export default function App() {
  const navigate = useNavigate();
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === MESSAGE_TYPE.NAVIGATION) {
    console.log("收到 popup 消息:", msg.payload);
    // 在这里做页面跳转、状态更新
    navigate(msg.payload.path);
  }
});

  return (
    <div>
      {/* <nav style={{ display: "flex", gap: "12px" }}>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/settings">设置</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
}
