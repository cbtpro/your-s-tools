import ToggleSetting from './toggle-setting';
import SelectSetting from './select-setting';
import InputSetting from './input-setting';
import type { YourToolApp } from '@your-s-tools/types';

interface Props {
  setting: YourToolApp.SettingOption;
  onChange: (key: keyof YourToolApp.Settings, value: any) => void;
  styles: Record<string, React.CSSProperties>;
}

export default function SettingFactory({ setting, onChange, styles }: Props) {
  switch (setting.type) {
    case 'toggle':
      return (
        <ToggleSetting
          label={setting.label}
          value={setting.value || false}
          onChange={(v) => onChange(setting.key, v)}
          styles={styles}
        />
      );
    case 'select':
      return (
        <SelectSetting
          label={setting.label}
          value={setting.value || ''}
          options={setting.options || []}
          onChange={(v) => onChange(setting.key, v)}
          styles={styles}
        />
      );
    case 'input':
      return (
        <InputSetting
          label={setting.label}
          value={setting.value || ''}
          onChange={(v) => onChange(setting.key, v)}
          styles={styles}
        />
      );
    default:
      return <div>未知设置类型: {setting.type}</div>;
  }
}
