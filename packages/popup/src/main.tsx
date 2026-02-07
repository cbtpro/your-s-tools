import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import { initI18n } from '@your-project/i18n';
import './index.css'
import App from './App.tsx'

/**
 * 封装核心渲染逻辑
 */
const renderApp = () => {
  const container = document.getElementById('root');
  if (!container) throw new Error('Failed to find the root element');

  createRoot(container).render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>
  );
};

/**
 * 初始化流程控制
 */
const bootstrap = async () => {
  try {
    // 1. 可以在这里并行执行其他初始化逻辑，如读取配置、初始化 SDK 等
    await initI18n();
  } catch (error) {
    console.error('Critical initialization failed:', error);
    // 即使 i18n 失败，我们也允许应用继续运行（使用默认回退语言）
  } finally {
    // 2. 无论初始化成功与否，最终都挂载应用
    renderApp();
  }
};

bootstrap();
