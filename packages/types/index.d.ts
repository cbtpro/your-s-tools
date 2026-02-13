export declare namespace YourToolApp {
  interface SettingOption {
    key: keyof YourToolApp.Settings;
    label: string;
    type: 'toggle' | 'select' | 'input';
    value?: any;
    options?: string[];
  }

  /**
   * 常规设置
   */
  type General = {
    /**
     * 语言
     */
    language: string;
  };
  /**
   * Dock 设置
   */
  interface Dock {
    /**
     * 自动隐藏
     */
    autoHide: boolean;
    triggerDistance: number;
  }
  /**
   * 高级设置
   */
  interface Advanced {

  }
  /**
   * 设置
   */
  interface Settings {
    count: number;
    /**
     * 常规设置
     */
    general: General;
    /**
     * 通用设置
     */
    settings: SettingOption[];
    /**
     * Dock 设置
     */
    dock: Dock;
    /**
     * 高级设置
     */
    advanced: Advanced;
    /**
     * 搜索引擎
     */
    searchEngine: LayoutJsonData[];
    /**
     * 暗黑模式
     */
    darkMode: boolean;
  }
  /**
   * 编辑状态
   */
  const enum EditStatus {
    /**
     * 编辑
     */
    Edit = 'edit',
    /**
     * 正常
     */
    Normal = 'normal',
  };
  /**
   * 布局json数据定义
   */
  interface LayoutJsonData {
    id: string;
    component: string;
  }
  /**
   * 资产类型
   */
  type PropertyType = "uri" | "group";

  /**
   * 资产实体基础类型
   */
  interface BasePropertyEntity {
    id?: string;
    type: PropertyType;
  }

  /**
   * 网址资产类型
   */
  interface UriPropertyEntity extends BasePropertyEntity {}
}
