import { 
  IconApps, IconSearch,
  IconFire, IconStar, IconLayout, IconFolder,
  IconAt, IconCode, IconQrcode, IconLink,
} from '@arco-design/web-react/icon';

export const iconMap = {
  layout: <IconLayout />,
  folder: <IconFolder />,
  apps: <IconApps />,
  search: <IconSearch />,
  popular: <IconFire />,
  favorite: <IconStar />,
  at: <IconAt />,
  code: <IconCode />,
  qrcode: <IconQrcode />,
  link: <IconLink />,
} as const;

export interface ComponentItem {
  type: string;
  label: string;
  group: string;
  icon?: keyof typeof iconMap;
}

export const componentList: ComponentItem[] = [
  { type: 'BaseLayout', label: '布局', group: '布局', icon: 'layout' },
  { type: 'BaseSection', label: '分组', group: '容器', icon: 'folder' },
  { type: 'BaseSwiper', label: 'Swiper', group: '容器', icon: 'folder' },
  { type: 'BaseNavbar', label: '导航栏', group: '功能', icon: 'apps' },
  { type: 'BaseSearchBar', label: '搜索框', group: '功能', icon: 'search' },
  { type: 'BasePopular', label: '热门推荐', group: '功能', icon: 'popular' },
  { type: 'BaseFavorite', label: '收藏夹', group: '功能', icon: 'favorite' },
  { type: 'BaseAt', label: '邮箱', group: '功能', icon: 'at' },
  { type: 'BaseCode', label: '代码片段', group: '功能', icon: 'code' },
  { type: 'BaseQrcode', label: '二维码', group: '功能', icon: 'qrcode' },
  { type: 'BaseLink', label: '网址', group: '功能', icon: 'link' },
];
