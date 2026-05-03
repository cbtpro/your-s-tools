import { useState, type ReactNode } from 'react';
import { Drawer } from '@arco-design/web-react';
import { Menu } from 'lucide-react';
import { useTranslation } from '@your-s-tools/i18n';

interface FloatingDrawerProps {
  children?: ReactNode;
  title?: string;
  width?: number | 'auto';
}

interface DrawerTriggerProps {
  title: string;
  onClick: () => void;
}

interface DrawerSectionProps {
  title: string;
  content: string;
}

function DrawerTrigger({ title, onClick }: DrawerTriggerProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="fixed top-24 left-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 opacity-30 hover:opacity-100"
    >
      <Menu size={24} />
    </button>
  );
}

function DrawerTitle({ children }: { children: ReactNode }) {
  return <span className="text-lg font-semibold">{children}</span>;
}

function DrawerSection({ title, content }: DrawerSectionProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  );
}

function DefaultDrawerContent() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('drawer.section1'),
      content: t('drawer.content1'),
    },
    {
      title: t('drawer.section2'),
      content: t('drawer.content2'),
    },
    {
      title: t('drawer.section3'),
      content: t('drawer.content3'),
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <DrawerSection
          key={section.title}
          title={section.title}
          content={section.content}
        />
      ))}
    </div>
  );
}

export default function FloatingDrawer({ children, title, width }: FloatingDrawerProps) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const drawerTitle = title || t('drawer.title');

  return (
    <>
      <DrawerTrigger title={t('drawer.title')} onClick={() => setVisible(true)} />

      <Drawer
        width={width ?? 320}
        title={<DrawerTitle>{drawerTitle}</DrawerTitle>}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        mask={false}
        footer={null}
        placement="left"
      >
        {children || <DefaultDrawerContent />}
      </Drawer>
    </>
  );
}
