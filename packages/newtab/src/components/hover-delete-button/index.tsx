import React from 'react';
import { Button, } from '@arco-design/web-react';
import { IconDelete  } from '@arco-design/web-react/icon';

interface HoverDeleteButtonProps {
  onClick: () => void;
  className?: string;
}

export const HoverDeleteButton: React.FC<HoverDeleteButtonProps> = ({ onClick, className }) => {
  return (
    <div className={['hover-delete-btn', className ? className : ''].join(' ')}>
      <Button
        onClick={onClick}
        aria-label="删除组件"
      >
        <IconDelete />
      </Button>
    </div>
  );
};

export default HoverDeleteButton;
