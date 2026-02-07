import { Routes, Route, useNavigate } from "react-router-dom";
import consola from 'consola';
import { MESSAGE_TYPE } from '@your-s-tools/shared';
import Home from '@/pages/home';
import About from '@/pages/about';
import LayoutEdit from '@/pages/layout-edit';
import Settings from '@/pages/settings';
import NotFound from '@/pages/notfound';

import './App.css'
import { useEffect } from "react";

export default function App() {
  const navigate = useNavigate();
  const routerMessage = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (message.type === MESSAGE_TYPE.NAVIGATION) {
      // console.log("收到 popup 消息:", msg.payload);
      consola.log("sender:", sender);
      sendResponse({ success: true });
      console.log("导航到:", message.payload.path);
      // 在这里做页面跳转、状态更新
      navigate(message.payload.path);
    }
  }
  useEffect(() => {
    chrome.runtime.onMessage.addListener(routerMessage);
    console.log('绑定事件');
    return () => {
      console.log('解绑事件');
      chrome.runtime.onMessage.removeListener(routerMessage);
    };
  }, []);

  return (
    <div>
      {/* <nav style={{ display: "flex", gap: "12px" }}>
        <Link to="/">首页</Link>
        <Link to="/layout-edit">布局编辑</Link>
        <Link to="/about">关于</Link>
        <Link to="/settings">设置</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="layout-edit" element={<LayoutEdit />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
