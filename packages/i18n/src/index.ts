import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from '../locales/en-US.json';
import zhCN from '../locales/zh-CN.json';

export const resources = {
  'en-US': { translation: enUS },
  'zh-CN': { translation: zhCN },
} as const;

export const initI18n = async () => {
  const storage = await chrome.storage.local.get('general');
  const savedLanguage = storage?.general?.language || 'zh-CN';

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en-US',
      interpolation: { escapeValue: false },
      defaultNS: 'translation',
    });

  // 监听插件全局存储变化，同步语言状态
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.general) {
      const newLang = changes.general.newValue?.language;
      if (newLang && newLang !== i18n.language) {
        i18n.changeLanguage(newLang);
      }
    }
  });

  return i18n;
};

export const setAppLanguage = async (lang: keyof typeof resources) => {
  const storage = await chrome.storage.local.get('general');
  await chrome.storage.local.set({
    general: { ...storage?.general, language: lang }
  });
};

export default i18n;
