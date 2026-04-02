'use client';

import { useState, useEffect, useRef } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { Loader2, X, Type, AlignLeft, Flag, CalendarDays, Activity } from 'lucide-react';

interface TaskFormModalProps {
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; priority: TaskPriority; dueDate: string; status?: TaskStatus }) => void;
}

export function TaskFormModal({ task, onClose, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'MEDIUM');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'PENDING');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const isEditing = !!task;
  const hasChanges = isEditing
    ? title !== task.title ||
      description !== (task.description || '') ||
      priority !== task.priority ||
      status !== task.status ||
      dueDate !== (task.dueDate ? task.dueDate.split('T')[0] : '')
    : title.trim().length > 0;

  // Escape key to close, focus title on mount
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    titleRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : '',
      ...(isEditing ? { status } : {}),
    });
    setIsSubmitting(false);
  };

  const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'PENDING', label: 'Pending', color: 'border-amber-400 bg-amber-50 text-amber-700' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-400 bg-blue-50 text-blue-700' },
    { value: 'COMPLETED', label: 'Completed', color: 'border-green-400 bg-green-50 text-green-700' },
  ];

  const priorityOptions: { value: TaskPriority; label: string; activeColor: string }[] = [
    { value: 'LOW', label: 'Low', activeColor: 'bg-surface-200 border-surface-400 text-surface-700' },
    { value: 'MEDIUM', label: 'Medium', activeColor: 'bg-amber-50 border-amber-400 text-amber-700' },
    { value: 'HIGH', label: 'High', activeColor: 'bg-red-50 border-red-400 text-red-700' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="card max-w-lg w-full animate-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-surface-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700 flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5" />
              Title
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="input-field"
              required
              maxLength={200}
            />
            {title.length > 150 && (
              <p className="text-xs text-surface-400 text-right">{title.length}/200</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700 flex items-center gap-1.5">
              <AlignLeft className="h-3.5 w-3.5" />
              Description
              <span className="text-surface-400 font-normal">(optional)</span>
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

          {/* Status (only when editing) */}
          {isEditing && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Status
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      status === opt.value ? opt.color : 'border-surface-200 text-surface-500 hover:border-surface-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5" />
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      priority === opt.value ? opt.activeColor : 'border-surface-200 text-surface-500 hover:border-surface-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="text-xs text-surface-400 hover:text-surface-600"
                >
                  Clear date
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-surface-100">
            {isEditing && hasChanges && (
              <p className="text-xs text-amber-600">Unsaved changes</p>
            )}
            {(!isEditing || !hasChanges) && <div />}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || (isEditing && !hasChanges)}
                className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
