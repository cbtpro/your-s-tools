import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  useTranslation as useI18NextTranslation,
} from 'react-i18next';
import enUS from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';

// 1. 导出资源定义（命名导出）
export const resources = {
  'en-US': { translation: enUS },
  'zh-CN': { translation: zhCN },
} as const;

// 内部状态，防止 Chrome 监听器重复注册
let isLanguageListenerAdded = false;

/**
 * 2. 初始化 i18n（命名导出）
 */
export const initI18n = async () => {
  const storage = await chrome.storage.local.get('general');
  const savedLanguage = storage?.general?.language || 'zh-CN';

  if (!i18n.isInitialized) {
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'en-US',
        interpolation: { escapeValue: false },
        defaultNS: 'translation',
        react: {
          useSuspense: false,
        },
      });
  }

  if (!isLanguageListenerAdded) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.general) {
        const newLang = changes.general.newValue?.language;
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
 */
export const i18nInstance = i18n;

/**
 * 封装 react-i18next 的 useTranslation
 * 修复：移除显式泛型约束，直接透传参数，利用 TS 自动推断解决类型不兼容问题
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useTranslation = (ns?: any, options?: any) => {
  return useI18NextTranslation(ns, options);
};
