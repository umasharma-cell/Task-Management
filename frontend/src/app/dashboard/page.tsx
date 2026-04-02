'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { StatusSummary } from '@/components/tasks/StatusSummary';
import { SearchBar } from '@/components/tasks/SearchBar';
import { FilterDropdown } from '@/components/tasks/FilterDropdown';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Pagination } from '@/components/tasks/Pagination';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import { DashboardSkeleton, TaskListSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { taskApi } from '@/lib/task-api';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { Plus, ListTodo, SearchX } from 'lucide-react';
import toast from 'react-hot-toast';

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  PENDING: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
  COMPLETED: 'PENDING',
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const response = await taskApi.getAll(params);
      setTasks(response.data || []);
      if (response.meta) setMeta(response.meta);
    } catch {
      setHasError(true);
      if (!isInitialLoad) {
        toast.error('Failed to load tasks. Check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [page, statusFilter, debouncedSearch, isInitialLoad]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleStatus = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || togglingIds.has(taskId)) return;

    const previousStatus = task.status;
    const optimisticStatus = NEXT_STATUS[previousStatus];

    setTogglingIds((prev) => new Set(prev).add(taskId));
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: optimisticStatus } : t))
    );

    try {
      const response = await taskApi.toggleStatus(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? response.data! : t)));
      toast.success(`Moved to ${NEXT_STATUS[previousStatus].replace('_', ' ').toLowerCase()}`);
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: previousStatus } : t))
      );
      toast.error('Failed to update status');
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    try {
      await taskApi.delete(deletingTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      setDeletingTask(null);
      toast.success('Task deleted');
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTasks();
      }
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleCreateOrUpdate = async (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    status?: TaskStatus;
  }) => {
    try {
      if (editingTask) {
        const response = await taskApi.update(editingTask.id, {
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          dueDate: data.dueDate || undefined,
          ...(data.status ? { status: data.status } : {}),
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

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const openCreate = () => {
    setEditingTask(null);
    setShowCreateModal(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setShowCreateModal(true);
  };

  const hasActiveFilters = !!(debouncedSearch || statusFilter);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-surface-50">
        <Navbar />

        {/* Full-page skeleton on initial load */}
        {isInitialLoad && isLoading ? (
          <DashboardSkeleton />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-surface-900">My Tasks</h1>
                <p className="text-surface-500 text-sm mt-1">
                  {hasError
                    ? 'Having trouble loading your tasks'
                    : `${meta.total} task${meta.total !== 1 ? 's' : ''} total`}
                </p>
              </div>
              <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </button>
            </div>

            {/* Status summary cards */}
            {!hasError && (
              <div className="mb-8">
                <StatusSummary
                  tasks={tasks}
                  total={meta.total}
                  activeFilter={statusFilter}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <SearchBar value={search} onChange={setSearch} />
              <FilterDropdown value={statusFilter} onChange={handleFilterChange} />
            </div>

            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs text-surface-500">Active filters:</span>
                {debouncedSearch && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                    Search: &quot;{debouncedSearch}&quot;
                    <button onClick={() => setSearch('')} className="hover:text-brand-900 ml-0.5">&times;</button>
                  </span>
                )}
                {statusFilter && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                    Status: {statusFilter.replace('_', ' ')}
                    <button onClick={() => setStatusFilter('')} className="hover:text-brand-900 ml-0.5">&times;</button>
                  </span>
                )}
                <button
                  onClick={() => { setSearch(''); setStatusFilter(''); }}
                  className="text-xs text-surface-500 hover:text-surface-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Content area */}
            {hasError ? (
              <ErrorState
                title="Couldn't load your tasks"
                message="There was a problem connecting to the server. Please check your internet connection and try again."
                variant="network"
                onRetry={fetchTasks}
              />
            ) : isLoading && !isInitialLoad ? (
              // Subsequent load — show skeletons in place of tasks
              <TaskListSkeleton count={Math.min(tasks.length || 3, 5)} />
            ) : tasks.length === 0 && hasActiveFilters ? (
              <EmptyState
                icon={SearchX}
                title="No matching tasks"
                description="Try adjusting your search or filters to find what you're looking for."
                action={{
                  label: 'Clear Filters',
                  onClick: () => { setSearch(''); setStatusFilter(''); },
                }}
              />
            ) : tasks.length === 0 ? (
              <EmptyState
                icon={ListTodo}
                title="No tasks yet"
                description="Create your first task to start organizing your work. It only takes a few seconds."
                action={{
                  label: 'Create First Task',
                  onClick: openCreate,
                  icon: Plus,
                }}
              />
            ) : (
              <div className="space-y-3 animate-fade-in">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isToggling={togglingIds.has(task.id)}
                    onToggle={handleToggleStatus}
                    onEdit={openEdit}
                    onDelete={(id) => {
                      const t = tasks.find((t) => t.id === id);
                      if (t) setDeletingTask(t);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!hasError && !isLoading && (
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={meta.limit}
                onPageChange={setPage}
              />
            )}
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <TaskFormModal
            task={editingTask}
            onClose={() => { setShowCreateModal(false); setEditingTask(null); }}
            onSubmit={handleCreateOrUpdate}
          />
        )}

        {deletingTask && (
          <DeleteConfirmModal
            taskTitle={deletingTask.title}
            onConfirm={handleDelete}
            onCancel={() => setDeletingTask(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
