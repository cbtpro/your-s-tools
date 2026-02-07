import { useEffect, useState } from 'react';
import type { YourToolApp } from "@your-s-tools/types";
import useChromeStorage from './use-chrome-storage';
import { STORAGE_KEY, StorageAreaEnum } from '../constants/enums';

const useCountStorage = () : [YourToolApp.LayoutJsonData[], React.Dispatch<React.SetStateAction<YourToolApp.LayoutJsonData[]>>] => {
  const storage = useChromeStorage({ area: StorageAreaEnum.LOCAL });
  const [layoutJsonData, setLayoutJsonData] = useState<YourToolApp.LayoutJsonData[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storeLayoutJson = await storage.getItem(STORAGE_KEY.LAYOUT_JSON_DATA);
      if (storeLayoutJson) {
        setLayoutJsonData(storeLayoutJson);
      }
      setInitialized(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (initialized) {
      storage.setItem(STORAGE_KEY.LAYOUT_JSON_DATA, layoutJsonData);
    }
  }, [layoutJsonData, initialized, storage]);

  return [layoutJsonData, setLayoutJsonData];
};

export default useCountStorage;
