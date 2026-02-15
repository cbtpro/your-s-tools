import { useEffect, useState } from 'react';
import useChromeStorage, { type UseChromeStorageReturn } from './use-chrome-storage';
import { StorageAreaEnum } from '../constants/enums';
import { defaultSettings } from '../constants/settings-config';
import type { YourToolApp } from '@your-s-tools/types';

export const initialSettings: YourToolApp.Settings = {
  count: 0,
  layoutEdit: {
    isEditMode: false,
  },
  general: {
    language: 'zh-CN'
  },
  dock: {
    autoHide: false,
    triggerDistance: 100,
  },
  advanced: {},
  settings: defaultSettings,
  searchEngine: [],
  autoTheme: false,
  darkMode: false
};
const useSettingsStorage = () : [UseChromeStorageReturn<YourToolApp.Settings>] => {
  const storage = useChromeStorage<YourToolApp.Settings>({ area: StorageAreaEnum.LOCAL });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initial = async () => {
      const general = await storage.getItem('general');
      if (general) {
        storage.setItem('general', general);
      }
      const settings = await storage.getItem('settings');
      if (settings) {
        storage.setItem('settings', settings);
      }
      const dock = await storage.getItem('dock');
      if (dock) {
        storage.setItem('dock', dock);
      }
      const advanced = await storage.getItem('advanced');
      if (advanced) {
        storage.setItem('advanced', advanced);
      }
      setInitialized(true);
    };
    initial();
  }, []);

  useEffect(() => {
    if (initialized) {
      storage.setItem('general', initialSettings.general);
      storage.setItem('settings', initialSettings.settings);
      storage.setItem('dock', initialSettings.dock);
      storage.setItem('advanced', initialSettings.advanced);
    }
  }, [initialized, storage]);

  return [storage];
};

export default useSettingsStorage;
