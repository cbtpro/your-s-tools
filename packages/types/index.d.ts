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
   * 搜索结果打开方式
   */
  type SearchOpenTarget = 'currentTab' | 'newTab' | 'newWindow';

  /**
   * 二维码协议类型
   */
  type QrcodeProtocol = 'text' | 'url' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard' | 'geo' | 'event';

  /**
   * Wi-Fi 二维码加密类型
   */
  type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

  /**
   * 加密存储值
   */
  interface EncryptedValue {
    cipherText: string;
    iv: string;
    salt: string;
  }

  /**
   * 二维码组件表单数据
   */
  interface QrcodeFormState {
    protocol: QrcodeProtocol;
    text: string;
    url: string;
    ssid: string;
    password: string;
    encryption: WifiEncryption;
    hidden: boolean;
    email: string;
    subject: string;
    body: string;
    phone: string;
    smsMessage: string;
    name: string;
    latitude: string;
    longitude: string;
    eventTitle: string;
    eventLocation: string;
    eventStart: string;
    eventEnd: string;
  }

  /**
   * 二维码组件持久化数据，Wi-Fi 密码加密存储
   */
  type StoredQrcodeFormState = Omit<QrcodeFormState, 'password'> & {
    encryptedPassword?: EncryptedValue;
  };

  /**
   * 二维码历史项
   */
  interface QrcodeHistoryItem {
    id: string;
    protocol: QrcodeProtocol;
    label: string;
    createdAt: number;
    form: StoredQrcodeFormState;
  }

  /**
   * 二维码组件持久化状态
   */
  interface StoredQrcodeState {
    current?: StoredQrcodeFormState;
    history: Partial<Record<QrcodeProtocol, QrcodeHistoryItem[]>>;
    savedAt?: number;
  }

  /**
   * 命令面板设置
   */
  interface CommandPalette {
    /**
     * 搜索结果打开方式
     */
    searchOpenTarget: SearchOpenTarget;
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
    layoutEdit: {
      /**
       * 编辑模式
       */
      isEditMode?: boolean;
    };
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
     * 命令面板设置
     */
    commandPalette: CommandPalette;
    /**
     * 高级设置
     */
    advanced: Advanced;
    /**
     * 搜索引擎
     */
    searchEngine: LayoutJsonData[];
    /**
     * 跟随系统
     */
    autoTheme: boolean;
    /**
     * 暗黑模式
     */
    darkMode: boolean;
  }
  /**
   * 布局json数据定义
   */
  interface LayoutJsonData {
    id: string;
    component: string;
    layout?: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
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
