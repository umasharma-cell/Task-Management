'use client';

import { Task, TaskStatus, TaskPriority } from '@/types';
import { Circle, Clock, CheckCircle2, Edit3, Trash2, Calendar } from 'lucide-react';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; icon: typeof Circle }> = {
  PENDING: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: Circle },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: Clock },
  COMPLETED: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle2 },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; dot: string; border: string }> = {
  LOW: { label: 'Low', dot: 'bg-surface-400', border: 'border-l-surface-300' },
  MEDIUM: { label: 'Medium', dot: 'bg-amber-500', border: 'border-l-amber-400' },
  HIGH: { label: 'High', dot: 'bg-red-500', border: 'border-l-red-400' },
};

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const statusCfg = STATUS_CONFIG[task.status];
  const priorityCfg = PRIORITY_CONFIG[task.priority];
  const StatusIcon = statusCfg.icon;
  const isCompleted = task.status === 'COMPLETED';

  const isOverdue = task.dueDate && !isCompleted && new Date(task.dueDate) < new Date();

  return (
    <div
      className={`group bg-white rounded-2xl border border-surface-200 border-l-4 ${priorityCfg.border} shadow-sm p-5 hover:shadow-md transition-all duration-200 ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Status toggle */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex-shrink-0 ${statusCfg.color} hover:scale-110 transition-transform`}
          title={`Status: ${statusCfg.label} (click to change)`}
        >
          <StatusIcon className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className={`font-semibold text-surface-900 leading-snug ${
                isCompleted ? 'line-through text-surface-500' : ''
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-surface-500 mt-1 line-clamp-2">{task.description}</p>
              )}
            </div>

            {/* Actions — visible on hover on desktop, always on mobile */}
            <div className="flex items-center gap-0.5 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-surface-500">
              <span className={`h-2 w-2 rounded-full ${priorityCfg.dot}`} />
              {priorityCfg.label} Priority
            </span>
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 text-xs ${
                isOverdue ? 'text-red-500 font-medium' : 'text-surface-400'
              }`}>
                <Calendar className="h-3 w-3" />
                {isOverdue && 'Overdue: '}
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
