import useCountStorage from './hook/use-count-storage';
import useGeneralStorage from './hook/use-general-storage';
import useLayoutStorage from './hook/use-layout-storage';
import useChromeStorage from './utils/use-chrome-storage';
// import MESSAGE_TYPE from './constants/message-type';
// import { STORAGE_KEY } from './constants/enums';

export { STORAGE_KEY, StorageAreaEnum, MESSAGE_TYPE } from './constants'

import { version } from './env';

export {
  useCountStorage,
  useGeneralStorage,
  useLayoutStorage,
  useChromeStorage,
  // MESSAGE_TYPE,
  // STORAGE_KEY,
  version,
};
