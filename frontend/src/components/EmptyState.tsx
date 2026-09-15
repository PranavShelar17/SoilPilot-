import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are no items or fields to display currently.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
        {icon || <Layers className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
