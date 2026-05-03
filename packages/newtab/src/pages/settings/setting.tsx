import { Switch, Slider, Button, Notification, Select, Popconfirm } from '@arco-design/web-react';
import { supportedLanguages, useTranslation } from '@your-s-tools/i18n';
import { RotateCcw, Globe } from 'lucide-react';
import type { YourToolApp } from '@your-s-tools/types';
import { initialSettings, useStorageState } from '@your-s-tools/shared';

const SEARCH_OPEN_TARGET_OPTIONS: Array<{
  value: YourToolApp.CommandPalette['searchOpenTarget'];
  labelKey: string;
}> = [
  { value: 'newTab', labelKey: 'settings.searchOpenTargets.newTab' },
  { value: 'currentTab', labelKey: 'settings.searchOpenTargets.currentTab' },
  { value: 'newWindow', labelKey: 'settings.searchOpenTargets.newWindow' },
];

const SLIDER_MARKS = {
  50: '50',
  150: '150',
  300: '300',
};

interface SettingProps {
  autoHide?: boolean;
  onAutoHideChange: (value: boolean) => void;
  triggerDistance?: number;
  onTriggerDistanceChange: (value: number) => void;
  searchOpenTarget?: YourToolApp.CommandPalette['searchOpenTarget'];
  onSearchOpenTargetChange?: (value: YourToolApp.CommandPalette['searchOpenTarget']) => void;
  onResetToDefault: () => void;
}

// 通用组件：设置区域
function SettingSection({
  titleKey,
  children,
  className = ""
}: {
  titleKey: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
        {t(titleKey)}
      </h4>
      {children}
    </div>
  );
}

// 通用组件：设置项
function SettingItem({
  titleKey,
  descriptionKey,
  control,
  layout = "horizontal"
}: {
  titleKey: string;
  descriptionKey: string;
  control: React.ReactNode;
  layout?: "horizontal" | "vertical";
}) {
  const { t } = useTranslation();

  if (layout === "vertical") {
    return (
      <div className="space-y-2">
        <div className="font-medium text-gray-800">{t(titleKey)}</div>
        <div className="text-sm text-gray-500">{t(descriptionKey)}</div>
        {control}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="font-medium text-gray-800">{t(titleKey)}</div>
        <div className="text-sm text-gray-500">{t(descriptionKey)}</div>
      </div>
      {control}
    </div>
  );
}

// 通用组件：选择控件
function SettingSelect({
  value,
  onChange,
  options,
  width = 140,
  prefix
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  width?: number;
  prefix?: React.ReactNode;
}) {
  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ width }}
      prefix={prefix}
    >
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
}

// 通用组件：翻译选择控件
function SettingSelectTranslated<T extends string>({
  value,
  onChange,
  options,
  width = 140
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; labelKey: string }>;
  width?: number;
}) {
  const { t } = useTranslation();

  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ width }}
    >
      {options.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {t(option.labelKey)}
        </Select.Option>
      ))}
    </Select>
  );
}

// 子组件：通用设置
function GeneralSettings({ general, onLanguageChange }: {
  general: YourToolApp.Settings['general'];
  onLanguageChange: (value: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <SettingSection titleKey="settings.generalSection">
      <div className="space-y-2">
        <SettingItem
          titleKey="settings.language"
          descriptionKey="settings.languageDesc"
          control={
            <SettingSelect
              value={general.language}
              onChange={onLanguageChange}
              options={supportedLanguages.map((language) => ({
                value: language.value,
                label: t(language.labelKey),
              }))}
              width={140}
              prefix={<Globe size={16} />}
            />
          }
        />
      </div>
    </SettingSection>
  );
}

// 子组件：命令面板设置
function CommandPaletteSettings({ currentSearchOpenTarget, onSearchOpenTargetChange }: {
  currentSearchOpenTarget: YourToolApp.CommandPalette['searchOpenTarget'];
  onSearchOpenTargetChange: (value: YourToolApp.CommandPalette['searchOpenTarget']) => void;
}) {
  return (
    <SettingSection titleKey="settings.commandPaletteSection" className="border-t border-gray-200 pt-6">
      <div className="space-y-2">
        <SettingItem
          titleKey="settings.searchOpenTarget"
          descriptionKey="settings.searchOpenTargetDesc"
          control={
            <SettingSelectTranslated
              value={currentSearchOpenTarget}
              onChange={onSearchOpenTargetChange}
              options={SEARCH_OPEN_TARGET_OPTIONS}
              width={150}
            />
          }
        />
      </div>
    </SettingSection>
  );
}

// 子组件：Dock设置
function DockSettings({
  autoHide,
  onAutoHideChange,
  triggerDistance,
  onTriggerDistanceChange
}: {
  autoHide: boolean;
  onAutoHideChange: (value: boolean) => void;
  triggerDistance: number;
  onTriggerDistanceChange: (value: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <SettingSection titleKey="settings.dockSection" className="border-t border-gray-200 pt-6">
      <div className="space-y-2">
        <SettingItem
          titleKey="settings.autoHide"
          descriptionKey="settings.autoHideDesc"
          control={<Switch checked={autoHide} onChange={onAutoHideChange} />}
        />
      </div>

      {autoHide && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <SettingItem
            titleKey={`settings.triggerDistance`}
            descriptionKey="settings.triggerDistanceDesc"
            control={
              <Slider
                value={triggerDistance}
                onChange={(val) => {
                  if (typeof val === 'number') {
                    onTriggerDistanceChange(val);
                  }
                }}
                min={50}
                max={300}
                step={10}
                showTicks
                marks={SLIDER_MARKS}
              />
            }
            layout="vertical"
          />
          <div className="text-sm text-gray-600">
            {t('settings.triggerDistance')}: {triggerDistance}{t('settings.pixels')}
          </div>
        </div>
      )}
    </SettingSection>
  );
}

// 子组件：重置设置
function ResetSettings({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="pt-4 border-t border-gray-100">
      <Popconfirm
        title={t('settings.resetConfirm')}
        onOk={onReset}
        okText={t('common.ok')}
        cancelText={t('common.cancel')}
      >
        <Button
          type="outline"
          long
          className="!flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          <span>{t('settings.resetToDefault')}</span>
        </Button>
      </Popconfirm>
    </div>
  );
}

export default function Setting({
  autoHide = false,
  onAutoHideChange,
  triggerDistance = 100,
  onTriggerDistanceChange,
  searchOpenTarget,
  onSearchOpenTargetChange,
  onResetToDefault,
}: SettingProps) {
  const { t, i18n } = useTranslation();
  const [notificationApi, notificationCtxHolder] = Notification.useNotification();

  // 状态管理
  const [general, setGeneral] = useStorageState<YourToolApp.Settings, 'general'>('general', initialSettings.general);
  const [storedCommandPalette, setStoredCommandPalette] = useStorageState<YourToolApp.Settings, 'commandPalette'>(
    'commandPalette',
    initialSettings.commandPalette,
  );
  const currentSearchOpenTarget = searchOpenTarget ?? storedCommandPalette.searchOpenTarget;

  // 事件处理
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    setGeneral({ ...general, language: value });
  };

  const handleSearchOpenTargetChange = (value: YourToolApp.CommandPalette['searchOpenTarget']) => {
    if (onSearchOpenTargetChange) {
      onSearchOpenTargetChange(value);
      return;
    }
    setStoredCommandPalette({ ...storedCommandPalette, searchOpenTarget: value });
  };

  const handleReset = () => {
    onResetToDefault();
    notificationApi.success!({
      title: t('settings.resetSuccessTitle'),
      content: t('settings.resetSuccessContent'),
    });
  };

  return (
    <>
      <GeneralSettings general={general} onLanguageChange={handleLanguageChange} />
      <CommandPaletteSettings
        currentSearchOpenTarget={currentSearchOpenTarget}
        onSearchOpenTargetChange={handleSearchOpenTargetChange}
      />
      <DockSettings
        autoHide={autoHide}
        onAutoHideChange={onAutoHideChange}
        triggerDistance={triggerDistance}
        onTriggerDistanceChange={onTriggerDistanceChange}
      />
      <ResetSettings onReset={handleReset} />
      {notificationCtxHolder}
    </>
  );
}
