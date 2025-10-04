import { useEffect, useState } from 'react';
import useChromeStorage from '../utils/use-chrome-storage';
import { STORAGE_KEY, StorageAreaEnum } from '../constants/enums';
import { YourToolApp } from '@your-s-tools/types';

const useSettingsStorage = () : [YourToolApp.Settings, React.Dispatch<React.SetStateAction<YourToolApp.Settings>>] => {
  const storage = useChromeStorage({ area: StorageAreaEnum.LOCAL });
  const [data, setData] = useState<YourToolApp.Settings>({
    general: {
      language: 'zh-CN'
    },
    dock: {
      autoHide: false,
    },
    advanced: {},
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initial = async () => {
      const storeData = await storage.getItem<YourToolApp.Settings>(STORAGE_KEY.COUNT);
      if (storeData) {
        setData(storeData);
      }
      setInitialized(true);
    };
    initial();
  }, []);

  useEffect(() => {
    if (initialized) {
      storage.setItem(STORAGE_KEY.COUNT, data);
    }
  }, [data, initialized, storage]);

  return [data, setData];
};

export default useSettingsStorage;