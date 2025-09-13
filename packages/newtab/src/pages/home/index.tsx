import { useEffect } from 'react'
import { Button } from "@arco-design/web-react";
import { useChromeStorage, useCountStorage } from '@your-s-tools/shared';

function Home() {
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
      <div className="card">
        <Button type="primary" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </div>
    </>
  )
}

export default Home;
