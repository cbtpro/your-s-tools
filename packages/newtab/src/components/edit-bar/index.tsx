import React from 'react';
import ComponentOperator from '@/components/component-operator';

interface EditBarProps {
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  onOpenComponents?: () => void;
  isDirty?: boolean;
}

const EditBar: React.FC<EditBarProps> = ({ onCancelEdit, onSaveEdit, onOpenComponents, isDirty }) => {
  return (
    <ComponentOperator
      onCancelEdit={onCancelEdit}
      onSaveEdit={onSaveEdit}
      onOpenComponents={onOpenComponents}
      isDirty={isDirty}
    />
  );
};

export default EditBar;
