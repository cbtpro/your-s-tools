import { useEffect, useState } from 'react';
import useBaseStorage from './use-chrome-storage';
import { STORAGE_KEY, StorageAreaEnum } from '../constants/enums';

const useGeneralStorage = <T extends Record<string, any>>(
  /**
   * 存储区域
   * 默认到本地存储
   */
  area: StorageAreaEnum = StorageAreaEnum.LOCAL,
  /**
   * 存储的 key
   */
  key: STORAGE_KEY
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] => {
  const storage = useBaseStorage<T>({ area });
  const [data, setData] = useState<T | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initCount = async () => {
      const storeData = await storage.getItem(key);
      if (storeData) {
        setData(storeData);
      }
      setInitialized(true);
    };
    initCount();
  }, []);

  useEffect(() => {
    if (initialized) {
      storage.setItem(key, data?.[key] ?? null);
    }
  }, [data, initialized, storage]);

  return [data, setData];
};

export default useGeneralStorage;
