import React from 'react';
import { Button as AButton } from '@arco-design/web-react';
import { IconSave } from '@arco-design/web-react/icon';

const ComponentOperator: React.FC = () => {
  return (
    <div>
      <AButton shape='circle' icon={<IconSave />} />
    </div>
  );
};

export default ComponentOperator;
