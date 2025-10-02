export declare namespace YourToolApp {
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
