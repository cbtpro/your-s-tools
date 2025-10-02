import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { defaultSettings, type SettingOption } from './settings-config';
import SettingFactory from './setting-factory';
import { settingsStyles as styles } from './settings-styles';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SettingOption[]>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem('userSettings');
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>设置中心</h2>
      </header>

      <main style={styles.main}>
        {settings.map((setting) => (
          <SettingFactory
            key={setting.key}
            setting={setting}
            onChange={handleChange}
            styles={styles}
          />
        ))}
      </main>

      <footer style={styles.footer}>
        <button style={styles.cancelButton} onClick={handleCancel}>
          取消
        </button>
        <button style={styles.saveButton} onClick={handleSave}>
          保存
        </button>
      </footer>
    </div>
  );
}
