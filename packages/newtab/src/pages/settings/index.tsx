import { useSettings } from '@/hooks/use-settings';
import SettingFactory from './setting-factory';
import { settingsStyles as styles } from './settings-styles';
import Setting from './setting';

export default function Settings() {
  const {
    settings,
    setSettings,
    dock,
    setDock,
    handleCancel,
    handleResetToDefault
  } = useSettings();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>设置中心</h2>
      </header>

      <main style={styles.main}>
        <Setting
          autoHide={dock.autoHide}
          onAutoHideChange={(value) => setDock({ ...dock, autoHide: value })}
          triggerDistance={dock.triggerDistance}
          onTriggerDistanceChange={(value) => setDock({ ...dock, triggerDistance: value })}
          onResetToDefault={handleResetToDefault}
        />
        {settings.map((setting) => (
          <SettingFactory
            key={setting.key}
            setting={setting}
            onChange={(key, value) => {
              const updatedSettings = settings.map((s) =>
                s.key === key ? { ...s, value } : s
              );
              setSettings(updatedSettings);
            }}
            styles={styles}
          />
        ))}
      </main>

      <footer style={styles.footer}>
        <button style={styles.cancelButton} onClick={handleCancel}>
          取消
        </button>
        <button style={styles.saveButton} onClick={handleResetToDefault}>
          恢复默认
        </button>
      </footer>
    </div>
  );
}
