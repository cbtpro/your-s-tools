import React from 'react';
import { Button, Popconfirm, } from '@arco-design/web-react';
import { IconDelete  } from '@arco-design/web-react/icon';

interface HoverDeleteButtonProps {
  onClick?: () => void;
  className?: string;
}

export const HoverDeleteButton: React.FC<HoverDeleteButtonProps> = ({ onClick, className }) => {
  return (
    <div className={['hover-delete-btn', className ? className : ''].join(' ')}>

      <Popconfirm
        title="确定要删除这个组件吗？"
        okText="删除"
        cancelText="取消"
        position="top"   // 让气泡在按钮上方，不挡住内容
        onOk={onClick}
      >
        <Button
          aria-label="删除组件"
          size="mini"
          status="warning"
        >
          <IconDelete />
        </Button>
      </Popconfirm>
    </div>
  );
};

export default HoverDeleteButton;
