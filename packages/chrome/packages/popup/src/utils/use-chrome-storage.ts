type StorageArea = 'local' | 'sync';

interface ChromeStorageOptions {
  area?: StorageArea; // 默认为 local
}

type StorageChangeCallback<T = any> = (newValue: T | null, oldValue: T | null) => void;

const NEVER_EXPIRES_FLAG = -1;

export const useChromeStorage = (options: ChromeStorageOptions = {}) => {
  const area: StorageArea = options.area || 'local';

  const getStorage = () => chrome.storage[area];

  // 存储变化回调集合
  const listeners = new Map<string, Set<StorageChangeCallback>>();

  /**
   * 设置存储项
   */
  const setItem = <T = any>(key: string, value: T, expired: number = NEVER_EXPIRES_FLAG): Promise<void> => {
    const expiredKey = `${key}__expires__`;
    let exp = expired === NEVER_EXPIRES_FLAG ? NEVER_EXPIRES_FLAG : Date.now() + 1000 * 60 * expired;

    const storageData: Record<string, any> = {};
    storageData[key] = value;
    storageData[expiredKey] = exp;

    return new Promise((resolve, reject) => {
      getStorage().set(storageData, () => {
        const err = chrome.runtime.lastError;
        if (err) reject(err);
        else resolve();
      });
    });
  };

  /**
   * 获取存储项
   */
  const getItem = async <T = any>(key: string): Promise<T | null> => {
    const expiredKey = `${key}__expires__`;
    return new Promise((resolve) => {
      getStorage().get([key, expiredKey], (items) => {
        const err = chrome.runtime.lastError;
        if (err) {
          console.error('获取数据失败:', err);
          resolve(null);
          return;
        }

        const expiredTime = items[expiredKey];
        if (expiredTime === undefined) {
          resolve(null);
          return;
        }

        if (expiredTime === NEVER_EXPIRES_FLAG || expiredTime > Date.now()) {
          resolve(items[key] as T);
        } else {
          // 已过期，删除数据
          removeItem(key);
          resolve(null);
        }
      });
    });
  };

  /**
   * 删除存储项
   */
  const removeItem = (key: string): Promise<void> => {
    const expiredKey = `${key}__expires__`;
    return new Promise((resolve, reject) => {
      getStorage().remove([key, expiredKey], () => {
        const err = chrome.runtime.lastError;
        if (err) reject(err);
        else resolve();
      });
    });
  };

  /**
   * 监听存储变化
   */
  const onChange = <T = any>(key: string, callback: StorageChangeCallback<T>) => {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key)!.add(callback);
  };

  const offChange = <T = any>(key: string, callback: StorageChangeCallback<T>) => {
    listeners.get(key)?.delete(callback);
  };
  debugger;
  // Chrome storage change 事件绑定
  chrome.storage.onChanged.addListener((changes, storageAreaName) => {
    debugger;
    if (storageAreaName !== area) return;

    Object.keys(changes).forEach((key) => {
      // 过滤过期时间 key
      if (key.endsWith('__expires__')) return;

      const newVal = changes[key].newValue;
      const oldVal = changes[key].oldValue;

      listeners.get(key)?.forEach((cb) => {
        debugger;
         cb(newVal, oldVal);
      });
    });
  });

  return {
    setItem,
    getItem,
    removeItem,
    onChange,
    offChange
  };
};

export default useChromeStorage;
