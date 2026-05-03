import { type ReactNode } from 'react';
import { Drawer } from '@arco-design/web-react';
import { useTranslation } from '@your-s-tools/i18n';

interface FloatingDrawerProps {
  children?: ReactNode;
  title?: string;
  width?: number | 'auto';
  visible: boolean;
  onClose: () => void;
}

interface DrawerSectionProps {
  title: string;
  content: string;
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

export default function FloatingDrawer({ children, title, width, visible, onClose }: FloatingDrawerProps) {
  const { t } = useTranslation();
  const drawerTitle = title || t('drawer.title');

  return (
    <Drawer
      width={width ?? 320}
      title={<DrawerTitle>{drawerTitle}</DrawerTitle>}
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      mask={false}
      footer={null}
      placement="left"
    >
      {children || <DefaultDrawerContent />}
    </Drawer>
  );
}
