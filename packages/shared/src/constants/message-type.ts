/**
 * 消息类型
 */
export const MESSAGE_TYPE = {
  /**
   * 路由跳转
   */
  NAVIGATION: 'NAVIGATION',

  /**
   * 切换编辑状态
   */
  TOGGLE_EDIT: 'TOGGLE_EDIT',

  /**
   * 打开设置
   */
  OPEN_SETTINGS: 'OPEN_SETTINGS',

  /**
   * 打开关于
   */
  OPEN_ABOUT: 'OPEN_ABOUT',
} as const;

export type MESSAGE_TYPE =
  (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export default MESSAGE_TYPE;
