import type { YourToolApp } from '@your-s-tools/types';
import { MESSAGE_TYPE, version, useStorageState, StorageAreaEnum } from '@your-s-tools/shared';
import Menu from './components/menu';
// import './App.css'

function App() {
  const [count, setCount] = useStorageState<YourToolApp.Settings, 'count'>('count', 0, { area: StorageAreaEnum.LOCAL, expired: 60 });

  const goToSomePath = (path: string) => {
    // 发送消息给扩展（包括 newTab 页面）
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.NAVIGATION, payload: { path } });
  }

  return (
    <>
      <div className="card">
        <Menu appName="Your's App" version={version} />
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => goToSomePath('/settings')}>设置</button>
        <button onClick={() => goToSomePath('/about')}>关于</button>
      </div>
    </>
  )
}

export default App
