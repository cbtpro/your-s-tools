import { useEffect, useState } from 'react';
import useChromeStorage from './use-chrome-storage';
import { STORAGE_KEY, StorageAreaEnum } from '../constants/enums';

const useUrlFavoritesStorage = <T>() : [T | null, React.Dispatch<React.SetStateAction<T | null>>] => {
  const storage = useChromeStorage({ area: StorageAreaEnum.LOCAL });
  const [data, setData] = useState<T | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initCount = async () => {
      const storeData = await storage.getItem(STORAGE_KEY.URL_FAVORITES);
      if (storeData) {
        setData(storeData);
      }
      setInitialized(true);
    };
    initCount();
  }, []);

  useEffect(() => {
    if (initialized) {
      storage.setItem(STORAGE_KEY.URL_FAVORITES, data);
    }
  }, [data, initialized, storage]);

  return [data, setData];
};

export default useUrlFavoritesStorage;
