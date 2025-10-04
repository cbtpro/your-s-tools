export declare namespace YourToolApp {
  /**
   * 常规设置
   */
  interface General {
    /**
     * 语言
     */
    language: string;
  }
  /**
   * Dock 设置
   */
  interface Dock {
    /**
     * 自动隐藏
     */
    autoHide: boolean;
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
    general: General;
    dock: Dock;
    advanced: Advanced;
  }
  /**
   * 编辑状态
   */
  enum EditStatus {
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
