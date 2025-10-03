export declare namespace YourToolApp {
  /**
   * 编辑状态
   * 使用 as const 来模拟 enum
   */
  const EditStatus = {
    /**
     * 编辑
     */
    Edit: "edit",
    /**
     * 正常
     */
    Normal: "normal",
  } as const;
  type EditStatus = keyof EditStatus;
  interface Settings {
    editStatus: EditStatus;
  }
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
