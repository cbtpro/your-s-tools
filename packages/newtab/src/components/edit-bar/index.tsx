import React from 'react';
import ComponentOperator from '@/components/component-operator';

interface EditBarProps {
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
}

const EditBar: React.FC<EditBarProps> = ({ onCancelEdit, onSaveEdit }) => {
  return (
    <ComponentOperator
      onCancelEdit={onCancelEdit}
      onSaveEdit={onSaveEdit}
    />
  );
};

export default EditBar;
