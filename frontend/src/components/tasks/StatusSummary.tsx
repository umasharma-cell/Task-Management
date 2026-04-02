'use client';

import { Circle, Clock, CheckCircle2, ListTodo } from 'lucide-react';
import { Task } from '@/types';

interface StatusSummaryProps {
  tasks: Task[];
  total: number;
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

const cards = [
  { key: '', label: 'All Tasks', icon: ListTodo, gradient: 'from-brand-500 to-brand-700' },
  { key: 'PENDING', label: 'Pending', icon: Circle, gradient: 'from-amber-400 to-amber-600' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Clock, gradient: 'from-blue-400 to-blue-600' },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, gradient: 'from-green-400 to-green-600' },
];

export function StatusSummary({ tasks, total, activeFilter, onFilterChange }: StatusSummaryProps) {
  const counts: Record<string, number> = {
    '': total,
    PENDING: tasks.filter((t) => t.status === 'PENDING').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    COMPLETED: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ key, label, icon: Icon, gradient }) => {
        const isActive = activeFilter === key;
        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-200 ${
              isActive
                ? 'ring-2 ring-brand-500 ring-offset-2 shadow-md'
                : 'hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${isActive ? 'text-brand-600' : 'text-surface-500'}`} />
                <span className="text-2xl font-bold text-surface-900">{counts[key]}</span>
              </div>
              <p className="text-xs font-medium text-surface-600">{label}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
