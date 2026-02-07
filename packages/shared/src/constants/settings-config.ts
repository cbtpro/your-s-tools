import type { YourToolApp } from '@your-s-tools/types';

// 默认设置
export const defaultSettings: YourToolApp.SettingOption[] = [
  { key: 'darkMode', label: '深色模式', type: 'toggle', value: false },
  {
    key: 'searchEngine',
    label: '默认搜索引擎',
    type: 'select',
    value: 'Google',
    options: ['Google', 'Bing', 'DuckDuckGo', 'Baidu'],
  },
  // { key: 'homeUrl', label: '主页地址', type: 'input', value: 'https://www.google.com' },
];
