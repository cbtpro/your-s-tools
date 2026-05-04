import { lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
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

const AsyncBaseNavbar = lazy(() => import('@/components/base-nav-bar'));
const AsyncBaseSearchBar = lazy(() => import('@/components/base-search-bar'));
const AsyncBasePopular = lazy(() => import('@/components/base-popular'));
const AsyncBaseFavorite = lazy(() => import('@/components/base-favorite'));
const AsyncBaseQrcode = lazy(() => import('@/components/base-qrcode'));

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

export interface ComponentSize {
  w: number;
  h: number;
}

export interface ComponentDefinition {
  type: string;
  labelKey: string;
  groupKey: ComponentGroupKey;
  icon: ComponentIconKey;
  enabled: boolean;
  defaultSize: ComponentSize;
  component?: LazyExoticComponent<ComponentType>;
}

export type ComponentItem = ComponentDefinition;

export const fallbackComponentSize: ComponentSize = { w: 4, h: 2 };

export const componentRegistry = {
  BaseLayout: {
    type: 'BaseLayout',
    labelKey: 'components.items.baseLayout',
    groupKey: 'layout',
    icon: 'layout',
    enabled: false,
    defaultSize: { w: 12, h: 4 },
  },
  // BaseSection: {
  //   type: 'BaseSection',
  //   labelKey: 'components.items.baseSection',
  //   groupKey: 'container',
  //   icon: 'folder',
  //   enabled: false,
  //   defaultSize: { w: 6, h: 4 },
  // },
  // BaseSwiper: {
  //   type: 'BaseSwiper',
  //   labelKey: 'components.items.baseSwiper',
  //   groupKey: 'container',
  //   icon: 'folder',
  //   enabled: false,
  //   defaultSize: { w: 6, h: 3 },
  // },
  BaseNavbar: {
    type: 'BaseNavbar',
    labelKey: 'components.items.baseNavbar',
    groupKey: 'feature',
    icon: 'apps',
    enabled: true,
    defaultSize: { w: 12, h: 1 },
    component: AsyncBaseNavbar,
  },
  BaseSearchBar: {
    type: 'BaseSearchBar',
    labelKey: 'components.items.baseSearchBar',
    groupKey: 'feature',
    icon: 'search',
    enabled: true,
    defaultSize: { w: 8, h: 2 },
    component: AsyncBaseSearchBar,
  },
  BasePopular: {
    type: 'BasePopular',
    labelKey: 'components.items.basePopular',
    groupKey: 'feature',
    icon: 'popular',
    enabled: true,
    defaultSize: { w: 4, h: 2 },
    component: AsyncBasePopular,
  },
  BaseFavorite: {
    type: 'BaseFavorite',
    labelKey: 'components.items.baseFavorite',
    groupKey: 'feature',
    icon: 'favorite',
    enabled: true,
    defaultSize: { w: 4, h: 2 },
    component: AsyncBaseFavorite,
  },
  BaseAt: {
    type: 'BaseAt',
    labelKey: 'components.items.baseAt',
    groupKey: 'feature',
    icon: 'at',
    enabled: false,
    defaultSize: { w: 4, h: 2 },
  },
  BaseCode: {
    type: 'BaseCode',
    labelKey: 'components.items.baseCode',
    groupKey: 'feature',
    icon: 'code',
    enabled: false,
    defaultSize: { w: 4, h: 3 },
  },
  BaseQrcode: {
    type: 'BaseQrcode',
    labelKey: 'components.items.baseQrcode',
    groupKey: 'feature',
    icon: 'qrcode',
    enabled: true,
    defaultSize: { w: 2, h: 2 },
    component: AsyncBaseQrcode,
  },
  BaseLink: {
    type: 'BaseLink',
    labelKey: 'components.items.baseLink',
    groupKey: 'feature',
    icon: 'link',
    enabled: false,
    defaultSize: { w: 4, h: 2 },
  },
} satisfies Record<string, ComponentDefinition>;

export const componentList: ComponentItem[] = Object.values(componentRegistry);

export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return componentRegistry[type as keyof typeof componentRegistry];
}

export function getComponentSize(type: string): ComponentSize {
  return getComponentDefinition(type)?.defaultSize ?? fallbackComponentSize;
}

export function getComponentRenderer(type: string) {
  return getComponentDefinition(type)?.component;
}

export const defaultSizeMap: Record<string, ComponentSize> = Object.fromEntries(
  componentList.map((component) => [component.type, component.defaultSize]),
);
