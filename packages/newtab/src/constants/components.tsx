import { IconApps, IconSearch, IconFire, IconStar } from '@arco-design/web-react/icon';

export const iconMap = {
  apps: <IconApps />,
  search: <IconSearch />,
  popular: <IconFire />,
  favorite: <IconStar />,
} as const;

export interface ComponentItem {
  type: string;
  label: string;
  group: string;
  icon?: keyof typeof iconMap;
}

export const componentList: ComponentItem[] = [
  { type: 'BaseNavbar', label: '导航栏', group: '布局', icon: 'apps' },
  { type: 'BaseSearchBar', label: '搜索框', group: '布局', icon: 'search' },
  { type: 'BasePopular', label: '热门推荐', group: '功能', icon: 'popular' },
  { type: 'BaseFavorite', label: '收藏夹', group: '功能', icon: 'favorite' },
];
