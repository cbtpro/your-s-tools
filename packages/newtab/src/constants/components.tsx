import {
  IconApps,
  IconAt,
  IconCode,
  IconFire,
  IconFolder,
  IconLayout,
  IconLink,
  IconQrcode,
  IconSearch,
  IconStar,
} from '@arco-design/web-react/icon';
import type { ReactNode } from 'react';

export const componentGroupKeys = ['layout', 'container', 'feature'] as const;
export type ComponentGroupKey = (typeof componentGroupKeys)[number];

export const componentIconMap = {
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
} satisfies Record<string, ReactNode>;

export type ComponentIconKey = keyof typeof componentIconMap;

export interface ComponentItem {
  type: string;
  labelKey: string;
  groupKey: ComponentGroupKey;
  icon: ComponentIconKey;
  enabled: boolean;
}

export const componentList: ComponentItem[] = [
  {
    type: 'BaseLayout',
    labelKey: 'components.items.baseLayout',
    groupKey: 'layout',
    icon: 'layout',
    enabled: false,
  },
  {
    type: 'BaseSection',
    labelKey: 'components.items.baseSection',
    groupKey: 'container',
    icon: 'folder',
    enabled: false,
  },
  {
    type: 'BaseSwiper',
    labelKey: 'components.items.baseSwiper',
    groupKey: 'container',
    icon: 'folder',
    enabled: false,
  },
  {
    type: 'BaseNavbar',
    labelKey: 'components.items.baseNavbar',
    groupKey: 'feature',
    icon: 'apps',
    enabled: true,
  },
  {
    type: 'BaseSearchBar',
    labelKey: 'components.items.baseSearchBar',
    groupKey: 'feature',
    icon: 'search',
    enabled: true,
  },
  {
    type: 'BasePopular',
    labelKey: 'components.items.basePopular',
    groupKey: 'feature',
    icon: 'popular',
    enabled: true,
  },
  {
    type: 'BaseFavorite',
    labelKey: 'components.items.baseFavorite',
    groupKey: 'feature',
    icon: 'favorite',
    enabled: true,
  },
  {
    type: 'BaseAt',
    labelKey: 'components.items.baseAt',
    groupKey: 'feature',
    icon: 'at',
    enabled: false,
  },
  {
    type: 'BaseCode',
    labelKey: 'components.items.baseCode',
    groupKey: 'feature',
    icon: 'code',
    enabled: false,
  },
  {
    type: 'BaseQrcode',
    labelKey: 'components.items.baseQrcode',
    groupKey: 'feature',
    icon: 'qrcode',
    enabled: false,
  },
  {
    type: 'BaseLink',
    labelKey: 'components.items.baseLink',
    groupKey: 'feature',
    icon: 'link',
    enabled: false,
  },
];
