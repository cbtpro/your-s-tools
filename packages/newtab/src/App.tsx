import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import consola from 'consola';
import { MESSAGE_TYPE } from '@your-s-tools/shared';
import { CommandPalette, useCommandPaletteShortcut } from '@/features/command-palette';
import { useRouterGuard } from "@/routes/router-guard";

import './App.css'

type ToolPanel = 'qrcode' | 'code';

const BaseQrcode = lazy(() => import('@/components/base-qrcode'));
const BaseCode = lazy(() => import('@/components/base-code'));
const Home = lazy(() => import('@/pages/home'));
const About = lazy(() => import('@/pages/about'));
const LayoutEdit = lazy(() => import('@/pages/layout-edit'));
const Settings = lazy(() => import('@/pages/settings'));
const NotFound = lazy(() => import('@/pages/notfound'));

export default function App() {
  const { safeNavigate } = useRouterGuard();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeToolPanel, setActiveToolPanel] = useState<ToolPanel | null>(null);
  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), []);

  useCommandPaletteShortcut(openCommandPalette);

  const routerMessage = useCallback((
    message: { type?: string; payload?: { path?: string } },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: { success: boolean }) => void,
  ) => {
    if (message.type === MESSAGE_TYPE.NAVIGATION) {
      // console.log("收到 popup 消息:", msg.payload);
      consola.log("sender:", sender);
      sendResponse({ success: true });
      console.log("导航到:", message.payload?.path);
      // 在这里做页面跳转、状态更新
      if (message.payload?.path === '/tools/qrcode') {
        setActiveToolPanel('qrcode');
        return;
      }
      if (message.payload?.path === '/tools/code') {
        setActiveToolPanel('code');
        return;
      }
      if (message.payload?.path) safeNavigate(message.payload.path);
    }
  }, [safeNavigate]);

  useEffect(() => {
    const openToolPanel = (event: Event) => {
      const tool = (event as CustomEvent<ToolPanel>).detail;
      if (tool === 'qrcode' || tool === 'code') {
        setActiveToolPanel(tool);
      }
    };

    window.addEventListener('your-s-tools:open-tool', openToolPanel);
    return () => window.removeEventListener('your-s-tools:open-tool', openToolPanel);
  }, []);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(routerMessage);
    console.log('绑定事件');
    return () => {
      console.log('解绑事件');
      chrome.runtime.onMessage.removeListener(routerMessage);
    };
  }, [routerMessage]);

  return (
    <div>
      {/* <nav style={{ display: "flex", gap: "12px" }}>
        <Link to="/">首页</Link>
        <Link to="/layout-edit">布局编辑</Link>
        <Link to="/about">关于</Link>
        <Link to="/settings">设置</Link>
      </nav> */}

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="layout-edit" element={<LayoutEdit />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <CommandPalette open={commandPaletteOpen} onClose={closeCommandPalette} />
      <Suspense fallback={null}>
        {activeToolPanel === 'qrcode' && <BaseQrcode variant="page" onClose={() => setActiveToolPanel(null)} />}
        {activeToolPanel === 'code' && <BaseCode variant="page" onClose={() => setActiveToolPanel(null)} />}
      </Suspense>
    </div>
  );
}
