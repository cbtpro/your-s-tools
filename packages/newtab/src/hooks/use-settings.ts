import { useNavigate } from 'react-router-dom';
import type { YourToolApp } from '@your-s-tools/types';
import { initialSettings, useStorageState, } from '@your-s-tools/shared';

export const useSettings = () => {
  const navigate = useNavigate();
  const [general, setGeneral] = useStorageState<YourToolApp.Settings, 'general'>('general', initialSettings.general);
  const [dock, setDock] = useStorageState<YourToolApp.Settings, 'dock'>('dock', initialSettings.dock);
  const [settings, setSettings] = useStorageState<YourToolApp.Settings, 'settings'>('settings', initialSettings.settings);
  const [advanced, setAdvanced] = useStorageState<YourToolApp.Settings, 'advanced'>('advanced', initialSettings.advanced);

  const handleCancel = () => {
    navigate('/');
  };

  const handleResetToDefault = () => {
    setGeneral(initialSettings.general);
    setDock(initialSettings.dock);
    setSettings(initialSettings.settings);
    setAdvanced(initialSettings.advanced);
  };

  return {
    general,
    setGeneral,
    dock,
    setDock,
    settings,
    setSettings,
    advanced,
    setAdvanced,
    handleCancel,
    handleResetToDefault,
  };
}
