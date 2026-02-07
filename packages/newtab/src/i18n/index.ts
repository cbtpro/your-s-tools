import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';

// 封装初始化逻辑
export const initI18n = async () => {
  // 获取存储的语言设置
  const storage = await chrome.storage.local.get('general');
  const savedLanguage = storage?.general?.language || 'zh-CN';

  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        'en-US': { translation: enUS },
        'zh-CN': { translation: zhCN },
      },
      lng: savedLanguage,
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

export default i18n;
