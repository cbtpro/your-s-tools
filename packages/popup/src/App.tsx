import { useEffect } from 'react'
import { useChromeStorage, useCountStorage, MESSAGE_TYPE, StorageAreaEnum, version } from '@your-s-tools/shared';
import Menu from './components/menu';
// import './App.css'

function App() {
  const storage = useChromeStorage({ area: StorageAreaEnum.LOCAL });
  const [count, setCount] = useCountStorage();
  const testChromeStorage = async () => {
    
    // 设置值
    await storage.setItem('color', 'blue', 10);

    // 获取值
    const color = await storage.getItem<string>('color');
    console.log('color:', color);

    // 删除值
    await storage.removeItem('color');

  }
  useEffect(() => {
    const colorChangedCallback = (newValue?: string | null, oldValue?: string | null) => {
      console.log('color changed:', oldValue, '→', newValue);
    }
    // 监听值变化
    storage.onChange('color', colorChangedCallback);
    return () => {
      // 取消监听
      storage.offChange('color', colorChangedCallback);
    }
  }, [])
  useEffect(() => {
    testChromeStorage()
  }, [])

  const goToSomePath = (path: string) => {
    // 发送消息给扩展（包括 newtab 页面）
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.NAVIGATION, payload: { path } });
  }

  return (
    <>
      <div className="card">
        <Menu appName="Your's App" version={version} />
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => goToSomePath('/settings')}>设置</button>
        <button onClick={() => goToSomePath('/about')}>关于</button> */}
      </div>
    </>
  )
}

export default App
