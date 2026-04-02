'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-surface-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-700">{title}</h3>
      <p className="text-surface-500 mt-1 max-w-sm mx-auto text-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-6 inline-flex items-center gap-2"
        >
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
        </button>
      )}
    </div>
  );
}
