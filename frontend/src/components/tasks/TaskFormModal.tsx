'use client';

import { useState } from 'react';
import { Task, TaskPriority } from '@/types';
import { Loader2, X } from 'lucide-react';

interface TaskFormModalProps {
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; priority: TaskPriority; dueDate: string }) => void;
}

export function TaskFormModal({ task, onClose, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'MEDIUM');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : '',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="card max-w-lg w-full animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-surface-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="input-field"
              required
              maxLength={200}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700">
              Description
              <span className="text-surface-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="input-field min-h-[100px] resize-y"
              maxLength={2000}
            />
            {description.length > 1800 && (
              <p className="text-xs text-surface-400 text-right">{description.length}/2000</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700">Priority</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((p) => {
                  const colors: Record<TaskPriority, string> = {
                    LOW: priority === p ? 'bg-surface-200 border-surface-400 text-surface-700' : 'border-surface-200 text-surface-500',
                    MEDIUM: priority === p ? 'bg-amber-50 border-amber-400 text-amber-700' : 'border-surface-200 text-surface-500',
                    HIGH: priority === p ? 'bg-red-50 border-red-400 text-red-700' : 'border-surface-200 text-surface-500',
                  };
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all ${colors[p]}`}
                    >
                      {p.charAt(0) + p.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-surface-100">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
