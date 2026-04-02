'use client';

import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'default' | 'network' | 'inline';
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\'t load this content. Please try again.',
  onRetry,
  variant = 'default',
}: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800">{title}</p>
          <p className="text-xs text-red-600 mt-0.5">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1 flex-shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  const Icon = variant === 'network' ? WifiOff : AlertTriangle;

  return (
    <div className="text-center py-16">
      <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-800">{title}</h3>
      <p className="text-surface-500 mt-1 max-w-sm mx-auto text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary mt-6 inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
