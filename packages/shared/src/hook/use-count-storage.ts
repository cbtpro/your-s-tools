import { useEffect, useState } from 'react';
import useChromeStorage from '../utils/use-chrome-storage';
import { STORAGE_KEY, StorageAreaEnum } from '../constants/enums';

const useCountStorage = () : [number, React.Dispatch<React.SetStateAction<number>>] => {
  const storage = useChromeStorage({ area: StorageAreaEnum.LOCAL });
  const [count, setCount] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initCount = async () => {
      const storeCount = await storage.getItem<number>(STORAGE_KEY.COUNT);
      if (storeCount) {
        setCount(storeCount);
      }
      setInitialized(true);
    };
    initCount();
  }, []);

  useEffect(() => {
    if (initialized) {
      storage.setItem(STORAGE_KEY.COUNT, count);
    }
  }, [count, initialized, storage]);

  return [count, setCount];
};

export default useCountStorage;