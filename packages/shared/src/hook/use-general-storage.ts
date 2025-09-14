import { useEffect, useState } from 'react';
import useChromeStorage from '../utils/use-chrome-storage';
import { STORAGE_KEY, StorageAreaEnum } from '../constants/enums';

const useGeneralStorage = <T>(
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
  const storage = useChromeStorage({ area });
  const [data, setData] = useState<T | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initCount = async () => {
      const storeData = await storage.getItem<T>(key);
      if (storeData) {
        setData(storeData);
      }
      setInitialized(true);
    };
    initCount();
  }, []);

  useEffect(() => {
    if (initialized) {
      storage.setItem(key, data);
    }
  }, [data, initialized, storage]);

  return [data, setData];
};

export default useGeneralStorage;
