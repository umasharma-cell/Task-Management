'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { taskApi } from '@/lib/task-api';
import { Task, TaskStatus, TaskPriority } from '@/types';
import {
  Plus, Search, Filter, Clock, CheckCircle2, Circle,
  Trash2, Edit3, ChevronLeft, ChevronRight, Loader2,
  AlertCircle, ListTodo
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; icon: typeof Circle }> = {
  PENDING: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: Circle },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: Clock },
  COMPLETED: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle2 },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; dot: string }> = {
  LOW: { label: 'Low', dot: 'bg-surface-400' },
  MEDIUM: { label: 'Medium', dot: 'bg-amber-500' },
  HIGH: { label: 'High', dot: 'bg-red-500' },
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const response = await taskApi.getAll(params);
      setTasks(response.data || []);
      if (response.meta) setMeta(response.meta);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleStatus = async (taskId: string) => {
    try {
      const response = await taskApi.toggleStatus(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? response.data! : t)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await taskApi.delete(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setDeletingTaskId(null);
      toast.success('Task deleted');
      if (tasks.length === 1 && page > 1) setPage(page - 1);
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleCreateOrUpdate = async (data: { title: string; description: string; priority: TaskPriority; dueDate: string }) => {
    try {
      if (editingTask) {
        const response = await taskApi.update(editingTask.id, {
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          dueDate: data.dueDate || undefined,
        });
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? response.data! : t)));
        toast.success('Task updated');
      } else {
        await taskApi.create({
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          dueDate: data.dueDate || undefined,
        });
        toast.success('Task created');
        setPage(1);
        fetchTasks();
      }
      setShowCreateModal(false);
      setEditingTask(null);
    } catch {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-surface-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">My Tasks</h1>
              <p className="text-surface-500 text-sm mt-1">
                {meta.total} task{meta.total !== 1 ? 's' : ''} total
              </p>
            </div>
            <button
              onClick={() => { setEditingTask(null); setShowCreateModal(true); }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks by title..."
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="input-field pl-10 pr-8 appearance-none cursor-pointer min-w-[180px]"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Task List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20">
              <ListTodo className="h-12 w-12 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-700">No tasks found</h3>
              <p className="text-surface-500 mt-1">
                {search || statusFilter ? 'Try adjusting your filters' : 'Create your first task to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const statusCfg = STATUS_CONFIG[task.status];
                const priorityCfg = PRIORITY_CONFIG[task.priority];
                const StatusIcon = statusCfg.icon;

                return (
                  <div
                    key={task.id}
                    className={`card flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow ${
                      task.status === 'COMPLETED' ? 'opacity-70' : ''
                    }`}
                  >
                    <button
                      onClick={() => handleToggleStatus(task.id)}
                      className={`flex-shrink-0 ${statusCfg.color} hover:opacity-70 transition-opacity`}
                      title="Toggle status"
                    >
                      <StatusIcon className="h-5 w-5" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-medium text-surface-900 ${
                          task.status === 'COMPLETED' ? 'line-through text-surface-500' : ''
                        }`}>
                          {task.title}
                        </h3>
                        <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-surface-500">
                          <span className={`h-1.5 w-1.5 rounded-full ${priorityCfg.dot}`} />
                          {priorityCfg.label}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-surface-500 mt-1 truncate">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-surface-400 mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => { setEditingTask(task); setShowCreateModal(true); }}
                        className="p-2 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTaskId(task.id)}
                        className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-surface-500">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= meta.totalPages}
                  className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <TaskFormModal
            task={editingTask}
            onClose={() => { setShowCreateModal(false); setEditingTask(null); }}
            onSubmit={handleCreateOrUpdate}
          />
        )}

        {/* Delete Confirmation */}
        {deletingTaskId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card max-w-sm w-full text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">Delete Task</h3>
              <p className="text-surface-500 text-sm">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeletingTaskId(null)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deletingTaskId)} className="btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

// Task form modal component
function TaskFormModal({
  task,
  onClose,
  onSubmit,
}: {
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; priority: TaskPriority; dueDate: string }) => void;
}) {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-lg w-full">
        <h3 className="text-xl font-semibold text-surface-900 mb-6">
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>

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
            <label className="text-sm font-medium text-surface-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details (optional)"
              className="input-field min-h-[100px] resize-y"
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="input-field"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
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
