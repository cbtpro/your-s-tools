import { useEffect, useState } from 'react'
import { Button } from "@arco-design/web-react";
import { useChromeStorage, useCountStorage, STORAGE_KEY, StorageAreaEnum } from '@your-s-tools/shared';

function Home() {
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
      console.log('颜色变化了:', oldValue, '→', newValue);
    }
    // 监听值变化
    storage.onChange('color', colorChangedCallback);
    return () => {
      // 取消监听
      storage.offChange('color', colorChangedCallback);
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
    storage.onChange(STORAGE_KEY.COUNT, onChangeHandle);
    return () => {
      storage.offChange(STORAGE_KEY.COUNT, onChangeHandle);
    }
  }, []);
  useEffect(() => {
    testChromeStorage()
  }, [])

  const [message, setMessage] = useState<string>('');


  return (
    <>
      <div className="card">
        <Button type="primary" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="input" />
    </>
  )
}

export default Home;
