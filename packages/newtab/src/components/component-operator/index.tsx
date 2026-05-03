import React from 'react';
import { Button as AButton } from '@arco-design/web-react';
import { Card as ACard } from '@arco-design/web-react';
import { IconSave } from '@arco-design/web-react/icon';

const ComponentOperator: React.FC = () => {
  return (
    <ACard>
      <AButton shape='circle' icon={<IconSave />} />
    </ACard>
  );
};

export default ComponentOperator;
