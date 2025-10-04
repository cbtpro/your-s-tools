import { Modal, Switch, Slider, Button, Notification, Select, Popconfirm,  } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { Settings2, RotateCcw, Globe } from 'lucide-react';

const Option = Select.Option;

interface DockSettingsProps {
  visible: boolean;
  onClose: () => void;
  autoHide: boolean;
  onAutoHideChange: (value: boolean) => void;
  triggerDistance: number;
  onTriggerDistanceChange: (value: number) => void;
  onResetToDefault: () => void;
}

export default function DockSettings({
  visible,
  onClose,
  autoHide,
  onAutoHideChange,
  triggerDistance,
  onTriggerDistanceChange,
  onResetToDefault,
}: DockSettingsProps) {
  const { t, i18n } = useTranslation();
  const [notificationApi, notificationCtxHolder] = Notification.useNotification();

  const handleReset = () => {
    onResetToDefault();
    notificationApi.success!({
      title: '消息',
      content: 'Settings reset to default',
    });
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

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
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              {t('settings.generalSection')}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{t('settings.language')}</div>
                  <div className="text-sm text-gray-500">{t('settings.languageDesc')}</div>
                </div>
                <Select
                  value={i18n.language}
                  onChange={handleLanguageChange}
                  style={{ width: 140 }}
                  prefix={<Globe size={16} />}
                >
                  <Option value="zh">中文</Option>
                  <Option value="en">English</Option>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              {t('settings.dockSection')}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{t('settings.autoHide')}</div>
                  <div className="text-sm text-gray-500">{t('settings.autoHideDesc')}</div>
                </div>
                <Switch checked={autoHide} onChange={onAutoHideChange} />
              </div>
            </div>
          </div>

          {autoHide && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div>
                <div className="font-medium text-gray-800 mb-1">
                  {t('settings.triggerDistance')}: {triggerDistance}{t('settings.pixels')}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {t('settings.triggerDistanceDesc')}
                </div>
              </div>
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
                marks={{
                  50: '50',
                  150: '150',
                  300: '300',
                }}
              />
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <Popconfirm
              title={t('settings.resetConfirm')}
              onOk={handleReset}
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
        </div>
      </Modal>
      {notificationCtxHolder}
    </>
  );
}
