import React from 'react';
import { Button as AButton, Card as ACard, Popconfirm, Space } from '@arco-design/web-react';
import { IconClose, IconSave } from '@arco-design/web-react/icon';
import { useTranslation } from '@your-s-tools/i18n';

interface ComponentOperatorProps {
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
}

const ComponentOperator: React.FC<ComponentOperatorProps> = ({
  onCancelEdit,
  onSaveEdit,
}) => {
  const { t } = useTranslation();

  return (
    <ACard>
      <Space>
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
          />
        </Popconfirm>
        <Popconfirm
          title={t('components.operator.saveConfirm')}
          okText={t('components.operator.saveEdit')}
          cancelText={t('components.operator.keepEditing')}
          position="top"
          onOk={onSaveEdit}
        >
          <AButton
            aria-label={t('components.operator.saveEdit')}
            shape="circle"
            type="primary"
            icon={<IconSave />}
          />
        </Popconfirm>
      </Space>
    </ACard>
  );
};

export default ComponentOperator;
