import useCountStorage from './hook/use-count-storage';
import useGeneralStorage from './hook/use-general-storage';
import useLayoutStorage from './hook/use-layout-storage';
import useCompositionInput from './hook/use-composition-input';
import useChromeStorage from './hook/use-chrome-storage';
import useStorageState from './hook/use-storage-state';
import useSettingsStorage, { initialSettings, } from './hook/use-settings-storage';
// import MESSAGE_TYPE from './constants/message-type';
// import { STORAGE_KEY } from './constants/enums';

export { STORAGE_KEY, StorageAreaEnum, MESSAGE_TYPE } from './constants'

import { version } from './env';

export {
  useCountStorage,
  useGeneralStorage,
  useLayoutStorage,
  useCompositionInput,
  useChromeStorage,
  initialSettings,
  useStorageState,
  useSettingsStorage,
  // MESSAGE_TYPE,
  // STORAGE_KEY,
  version,
};
