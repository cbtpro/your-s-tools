import { useEffect } from 'react'
// import useChromeStorage from '@your-s-tools/shared/utils/use-chrome-storage';
// import useCountStorage from '@your-s-tools/shared/hook/use-count-storage';

import { useChromeStorage, useCountStorage } from '@your-s-tools/shared';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const storage = useChromeStorage({ area: 'local' });
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
    // 监听值变化
    storage.onChange('color', (newValue, oldValue) => {
      console.log('颜色变化了:', oldValue, '→', newValue);
    });
    return () => {
      // 取消监听
      storage.offChange('color', (newValue, oldValue) => {
        console.log('颜色变化了:', oldValue, '→', newValue);
      });
    }
  }, [])
  useEffect(() => {
    const onChangeHandle = (newValue: number | null, oldValue: number | null) => {
      if (newValue !== oldValue) {
        if (newValue === null) {
          newValue = 0;
        }
        setCount(newValue);
      }
    }
    storage.onChange('count', onChangeHandle);
    return () => {
      storage.offChange('count', onChangeHandle);
    }
  }, []);
  useEffect(() => {
    testChromeStorage()
  }, [])


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      新标签页122
    </>
  )
}

export default App
