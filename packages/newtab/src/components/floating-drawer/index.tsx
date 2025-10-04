import { useState, type ReactNode } from 'react';
import { Drawer } from '@arco-design/web-react';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FloatingDrawerProps {
  children?: ReactNode;
  title?: string;
  width?: number | 'auto';
}

export default function FloatingDrawer({ children, title, width }: FloatingDrawerProps) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <button
        onClick={() => setVisible(true)}
        className="fixed top-6 left-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 opacity-30 hover:opacity-100"
      >
        <Menu size={24} />
      </button>

      <Drawer
        width={width ?? 320}
        title={<span className="text-lg font-semibold">{title || t('drawer.title')}</span>}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        mask={false}
        footer={null}
        placement="left"
      >
        {children || (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">{t('drawer.section1')}</h3>
              <p className="text-sm text-gray-600">{t('drawer.content1')}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">{t('drawer.section2')}</h3>
              <p className="text-sm text-gray-600">{t('drawer.content2')}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">{t('drawer.section3')}</h3>
              <p className="text-sm text-gray-600">{t('drawer.content3')}</p>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
