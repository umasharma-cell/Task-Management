'use client';

import { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { Circle, Clock, CheckCircle2, Edit3, Trash2, Calendar, ArrowRight } from 'lucide-react';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; icon: typeof Circle; hoverBg: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: Circle, hoverBg: 'hover:bg-amber-50' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: Clock, hoverBg: 'hover:bg-blue-50' },
  COMPLETED: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle2, hoverBg: 'hover:bg-green-50' },
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  PENDING: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
  COMPLETED: 'PENDING',
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; dot: string; border: string }> = {
  LOW: { label: 'Low', dot: 'bg-surface-400', border: 'border-l-surface-300' },
  MEDIUM: { label: 'Medium', dot: 'bg-amber-500', border: 'border-l-amber-400' },
  HIGH: { label: 'High', dot: 'bg-red-500', border: 'border-l-red-400' },
};

interface TaskCardProps {
  task: Task;
  isToggling?: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, isToggling, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const statusCfg = STATUS_CONFIG[task.status];
  const priorityCfg = PRIORITY_CONFIG[task.priority];
  const StatusIcon = statusCfg.icon;
  const isCompleted = task.status === 'COMPLETED';
  const nextStatus = NEXT_STATUS[task.status];

  const isOverdue = task.dueDate && !isCompleted && new Date(task.dueDate) < new Date();

  const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });

  return (
    <div
      className={`group bg-white rounded-2xl border border-surface-200 border-l-4 ${priorityCfg.border} shadow-sm p-5 hover:shadow-md transition-all duration-200 ${
        isCompleted ? 'opacity-60' : ''
      } ${isToggling ? 'scale-[0.99] opacity-80' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Status toggle button */}
        <div className="relative mt-0.5">
          <button
            onClick={() => onToggle(task.id)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            disabled={isToggling}
            className={`flex-shrink-0 ${statusCfg.color} ${statusCfg.hoverBg} p-1 rounded-lg transition-all duration-200 ${
              isToggling ? 'animate-pulse' : 'hover:scale-110 active:scale-95'
            }`}
            aria-label={`Change status to ${STATUS_CONFIG[nextStatus].label}`}
          >
            <StatusIcon className="h-5 w-5" />
          </button>

          {/* Next status tooltip */}
          {showTooltip && !isToggling && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1.5 bg-surface-800 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
              <div className="flex items-center gap-1.5">
                {statusCfg.label}
                <ArrowRight className="h-3 w-3" />
                {STATUS_CONFIG[nextStatus].label}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-surface-800" />
            </div>
          )}
        </div>

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

            {/* Actions */}
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
              {priorityCfg.label}
            </span>
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 text-xs ${
                isOverdue ? 'text-red-500 font-medium' : 'text-surface-400'
              }`}>
                <Calendar className="h-3 w-3" />
                {isOverdue && 'Overdue: '}
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </span>
            )}
            <span className="text-xs text-surface-300">
              Created {createdDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
