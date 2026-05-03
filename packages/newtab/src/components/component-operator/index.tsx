import React from 'react';
import { Button as AButton, Card as ACard, Divider, Popconfirm, Space } from '@arco-design/web-react';
import { IconApps, IconClose, IconSave } from '@arco-design/web-react/icon';
import { useTranslation } from '@your-s-tools/i18n';

interface ComponentOperatorProps {
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  onOpenComponents?: () => void;
  isDirty?: boolean;
}

const ComponentOperator: React.FC<ComponentOperatorProps> = ({
  onCancelEdit,
  onSaveEdit,
  onOpenComponents,
  isDirty = false,
}) => {
  const { t } = useTranslation();

  return (
    <ACard>
      <Space split={<Divider type="vertical" />}>
        <AButton
          aria-label={t('components.operator.openComponents')}
          shape="circle"
          icon={<IconApps />}
          onClick={onOpenComponents}
        />
        <Popconfirm
          title={t('components.operator.cancelConfirm')}
          okText={t('components.operator.cancelEdit')}
          cancelText={t('components.operator.keepEditing')}
          position="top"
          onOk={onCancelEdit}
        >
          <AButton
            aria-label={t('components.operator.cancelEdit')}
            shape="circle"
            status="warning"
            icon={<IconClose />}
            disabled={!isDirty}
          />
        </Popconfirm>
        <Popconfirm
          title={t('components.operator.saveConfirm')}
          okText={t('components.operator.saveEdit')}
          cancelText={t('components.operator.keepEditing')}
          position="top"
          onOk={onSaveEdit}
          disabled={!isDirty}
        >
          <AButton
            aria-label={t('components.operator.saveEdit')}
            shape="circle"
            type="primary"
            icon={<IconSave />}
            disabled={!isDirty}
          />
        </Popconfirm>
      </Space>
    </ACard>
  );
};

export default ComponentOperator;
