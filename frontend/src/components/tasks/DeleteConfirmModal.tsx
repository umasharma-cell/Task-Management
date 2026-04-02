'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmModal({ onConfirm, onCancel }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="card max-w-sm w-full text-center space-y-4 animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900">Delete Task</h3>
        <p className="text-surface-500 text-sm">
          This task will be permanently removed. This action cannot be undone.
        </p>
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
