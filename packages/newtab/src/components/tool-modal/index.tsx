import type { ReactNode } from 'react';
import { Modal } from '@arco-design/web-react';
import styles from './style.module.scss';

interface ToolModalProps {
  title: ReactNode;
  visible: boolean;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onCancel: () => void;
}

export default function ToolModal({
  title,
  visible,
  header,
  children,
  footer,
  onCancel,
}: ToolModalProps) {
  return (
    <Modal
      className={styles.modal}
      wrapClassName={styles.wrap}
      title={<div className={styles.header}>{header}</div>}
      visible={visible}
      footer={footer ? <div className={styles.footer}>{footer}</div> : null}
      unmountOnExit={false}
      onCancel={onCancel}
    >
      <div className={styles.body} aria-label={typeof title === 'string' ? title : undefined}>
        {children}
      </div>
    </Modal>
  );
}
