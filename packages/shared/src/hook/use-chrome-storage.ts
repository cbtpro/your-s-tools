import { StorageAreaEnum } from '../constants/enums';

// --- 类型定义 ---

export interface ChromeStorageOptions {
  area?: StorageAreaEnum;
}

export type StorageChangeCallback<T> = (
  newValue: T | null,
  oldValue: T | null
) => void;

export interface UseChromeStorageReturn<T extends Record<string, any>> {
  setItem: <K extends keyof T>(key: K, value: T[K], expiredMinutes?: number) => Promise<void>;
  getItem: <K extends keyof T>(key: K) => Promise<T[K] | null>;
  removeItem: <K extends keyof T>(key: K) => Promise<void>;
  clear: () => Promise<void>;
  onChange: <K extends keyof T>(key: K, callback: StorageChangeCallback<T[K]>) => void;
  offChange: <K extends keyof T>(key: K, callback: StorageChangeCallback<T[K]>) => void;
}

export type UseChromeStorage = <T extends Record<string, any>>(
  options?: ChromeStorageOptions
) => UseChromeStorageReturn<T>;

export const NEVER_EXPIRES_FLAG = -1;

// --- 内部常量与全局状态 ---

const EXPIRE_SUFFIX = '__expires__';

/**
 * 全局监听器 Map
 * Key 格式为 "area:key"，例如 "local:token"
 */
const globalListeners = new Map<string, Set<StorageChangeCallback<any>>>();

// 注册全局唯一的 onChanged 监听
chrome.storage.onChanged.addListener((changes, areaName) => {
  Object.keys(changes).forEach((rawKey) => {
    if (rawKey.endsWith(EXPIRE_SUFFIX)) return;

    const compositeKey = `${areaName}:${rawKey}`;
    const listeners = globalListeners.get(compositeKey);

    if (listeners && listeners.size > 0) {
      const { newValue, oldValue } = changes[rawKey];
      listeners.forEach((cb) => cb(newValue, oldValue));
    }
  });
});

// --- Hook 实现 ---

export const useChromeStorage: UseChromeStorage = <T extends Record<string, any>>(
  options: ChromeStorageOptions = {}
) => {
  const area = options.area || StorageAreaEnum.LOCAL;
  const storage = chrome.storage[area];

  /**
   * 写入数据
   * @param expiredMinutes 过期时间（分钟）
   */
  const setItem = async <K extends keyof T>(
    key: K,
    value: T[K],
    expiredMinutes: number = NEVER_EXPIRES_FLAG
  ): Promise<void> => {
    const keyStr = String(key);
    const expiredKey = `${keyStr}${EXPIRE_SUFFIX}`;
    const exp =
      expiredMinutes === NEVER_EXPIRES_FLAG
        ? NEVER_EXPIRES_FLAG
        : Date.now() + 1000 * 60 * expiredMinutes;

    return new Promise((resolve, reject) => {
      storage.set({ [keyStr]: value, [expiredKey]: exp }, () => {
        const err = chrome.runtime.lastError;
        err ? reject(err) : resolve();
      });
    });
  };

  /**
   * 读取数据（包含过期校验）
   */
  const getItem = async <K extends keyof T>(key: K): Promise<T[K] | null> => {
    const keyStr = String(key);
    const expiredKey = `${keyStr}${EXPIRE_SUFFIX}`;

    return new Promise((resolve) => {
      storage.get([keyStr, expiredKey], (items) => {
        const expiredTime = items[expiredKey];

        // 逻辑：如果设置了过期时间且已超时
        if (
          expiredTime !== undefined &&
          expiredTime !== NEVER_EXPIRES_FLAG &&
          expiredTime <= Date.now()
        ) {
          removeItem(key); // 自动物理清理
          resolve(null);
          return;
        }

        const value = items[keyStr];
        resolve(value !== undefined ? (value as T[K]) : null);
      });
    });
  };

  /**
   * 移除指定数据
   */
  const removeItem = async <K extends keyof T>(key: K): Promise<void> => {
    const keyStr = String(key);
    return new Promise((resolve, reject) => {
      storage.remove([keyStr, `${keyStr}${EXPIRE_SUFFIX}`], () => {
        const err = chrome.runtime.lastError;
        err ? reject(err) : resolve();
      });
    });
  };

  /**
   * 清空当前区域所有数据
   */
  const clear = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      storage.clear(() => {
        const err = chrome.runtime.lastError;
        err ? reject(err) : resolve();
      });
    });
  };

  /**
   * 订阅变更
   */
  const onChange = <K extends keyof T>(key: K, callback: StorageChangeCallback<T[K]>) => {
    const compositeKey = `${area}:${String(key)}`;
    if (!globalListeners.has(compositeKey)) {
      globalListeners.set(compositeKey, new Set());
    }
    globalListeners.get(compositeKey)!.add(callback);
  };

  /**
   * 取消订阅
   */
  const offChange = <K extends keyof T>(key: K, callback: StorageChangeCallback<T[K]>) => {
    const compositeKey = `${area}:${String(key)}`;
    globalListeners.get(compositeKey)?.delete(callback);
  };

  return {
    setItem,
    getItem,
    removeItem,
    clear,
    onChange,
    offChange,
  };
};

export default useChromeStorage;
