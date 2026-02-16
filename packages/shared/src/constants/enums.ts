
/**
 * Storage Key 枚举
 */
export const STORAGE_KEY = {
  /**
   * 编辑布局
   */
  EDITING_LAYOUT: 'EDITING_LAYOUT',
  /**
   * 布局信息
   */
  LAYOUT_JSON_DATA: 'LAYOUT_JSON_DATA',
  /**
   * 网址收藏夹
   */
  URL_FAVORITES: 'URL_FAVORITES',
  /**
   * 计数器
   */
  COUNT: 'COUNT',
  /**
   * 设置项
   */
  SETTINGS: 'SETTINGS',
} as const;

export type STORAGE_KEY =
  (typeof STORAGE_KEY)[keyof typeof STORAGE_KEY];

/**
 * Chrome 存储区域枚举
 */
export const StorageAreaEnum = {
  LOCAL: 'local',
  SYNC: 'sync'
} as const;

export type StorageAreaEnum = (typeof StorageAreaEnum)[keyof typeof StorageAreaEnum];
