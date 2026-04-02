'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  taskTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmModal({ taskTitle, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, isDeleting]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => !isDeleting && onCancel()}>
      <div className="card max-w-sm w-full text-center space-y-4 animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-surface-900">Delete Task</h3>
          <p className="text-surface-500 text-sm mt-2">
            Are you sure you want to delete
          </p>
          <p className="text-surface-800 font-medium text-sm mt-1 truncate px-4">
            &quot;{taskTitle}&quot;
          </p>
          <p className="text-surface-400 text-xs mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button onClick={onCancel} className="btn-secondary" disabled={isDeleting}>
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn-danger flex items-center gap-2" disabled={isDeleting}>
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
