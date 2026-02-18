import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from '../locales/en-US.json';
import zhCN from '../locales/zh-CN.json';

// 1. 导出资源定义（命名导出）
export const resources = {
  'en-US': { translation: enUS },
  'zh-CN': { translation: zhCN },
} as const;

// 内部状态，防止 Chrome 监听器重复注册
let isLanguageListenerAdded = false;

/**
 * 2. 初始化 i18n（命名导出）
 * 包含从 chrome.storage 加载配置及监听自动更新
 */
export const initI18n = async () => {
  const storage = await chrome.storage.local.get('general');
  const savedLanguage = storage?.general?.language || 'zh-CN';

  // 如果已经初始化过，且 i18next 实例已存在，直接返回
  if (!i18n.isInitialized) {
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'en-US',
        interpolation: { escapeValue: false },
        defaultNS: 'translation',
        // 允许检测语言变化
        react: {
          useSuspense: false,
        },
      });
  }

  // 3. 监听插件全局存储变化，同步语言状态（单例模式）
  if (!isLanguageListenerAdded) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.general) {
        const newLang = changes.general.newValue?.language;
        // 确保实例存在且语言确实发生了变化
        if (newLang && newLang !== i18n.language) {
          i18n.changeLanguage(newLang);
        }
      }
    });
    isLanguageListenerAdded = true;
  }

  return i18n;
};

/**
 * 4. 设置语言（命名导出）
 * 封装持久化逻辑，供 UI 层的语言切换组件调用
 */
export const setAppLanguage = async (lang: keyof typeof resources) => {
  const storage = await chrome.storage.local.get('general');
  await chrome.storage.local.set({
    general: {
      ...storage?.general,
      language: lang
    }
  });
};

/**
 * 5. 导出 i18n 实例本身（命名导出）
 * 代替 export default，彻底解决 Rollup 警告
 */
export const i18nInstance = i18n;
