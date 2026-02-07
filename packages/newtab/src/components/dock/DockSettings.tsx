import { Modal, } from '@arco-design/web-react';
import { useTranslation, } from 'react-i18next';
import { Settings2, } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import Settings from '@/pages/settings/setting';


interface DockSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export default function DockSettings({
  visible,
  onClose,
}: DockSettingsProps) {
  const { t, } = useTranslation();

  const {
    dock,
    setDock,
    handleResetToDefault
  } = useSettings();
  const onHandleChange = (bool: boolean) => {
    setDock({ ...dock, autoHide: bool });
  }
  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Settings2 size={20} />
            <span>{t('settings.title')}</span>
          </div>
        }
        visible={visible}
        onOk={onClose}
        onCancel={onClose}
        autoFocus={false}
        focusLock={true}
        footer={null}
        style={{ width: 520 }}
      >
        <div className="space-y-6 py-4">
          <Settings
            autoHide={dock.autoHide}
            onAutoHideChange={onHandleChange}
            triggerDistance={dock.triggerDistance}
            onTriggerDistanceChange={(value) => setDock({ ...dock, triggerDistance: value })}
            onResetToDefault={handleResetToDefault}
          />
        </div>
      </Modal>
    </>
  );
}
