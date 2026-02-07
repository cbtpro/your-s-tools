import { useState, useEffect, useCallback } from 'react';
import { useChromeStorage } from './use-chrome-storage'; // 引入刚才修改的工具
import { StorageAreaEnum } from '../constants/enums';

/**
 * 响应式 Storage Hook
 * @param key 存储的键名
 * @param defaultValue 初始默认值
 * @param options 配置项（area等）
 */
export default function useStorageState<T extends Record<string, any>, K extends keyof T>(
  key: K,
  defaultValue: T[K],
  options: { area?: StorageAreaEnum; expired?: number } = {}
) {
  const { getItem, setItem, onChange, offChange } = useChromeStorage<T>(options);

  // 1. 初始化本地 State
  const [state, setState] = useState<T[K]>(defaultValue);

  // 2. 首次加载数据
  useEffect(() => {
    getItem(key).then((val) => {
      if (val !== null) {
        setState(val);
      }
    });
  }, [key]);

  // 3. 监听外部变化（实现多页面/多组件同步）
  useEffect(() => {
    const handleUpdate = (newValue: T[K] | null) => {
      // 如果值被删除了，回退到 defaultValue
      setState(newValue !== null ? newValue : defaultValue);
    };

    onChange(key, handleUpdate);
    return () => offChange(key, handleUpdate);
  }, [key, defaultValue]);

  // 4. 封装更新方法
  const updateState = useCallback(
    async (newValue: T[K] | ((prev: T[K]) => T[K])) => {
      let finalValue: T[K];

      if (typeof newValue === 'function') {
        // 处理函数式更新，类似于 setState(prev => prev + 1)
        const current = await getItem(key);
        finalValue = (newValue as Function)(current !== null ? current : defaultValue);
      } else {
        finalValue = newValue;
      }

      // 写入存储，触发全局 onChange，进而通过上面的 useEffect 更新本地 state
      await setItem(key, finalValue, options.expired);
    },
    [key, options.expired, defaultValue]
  );

  return [state, updateState] as const;
}
