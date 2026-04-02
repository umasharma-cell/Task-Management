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
import { taskApi } from '@/lib/task-api';
import { Task, TaskPriority } from '@/types';
import { Plus, Loader2, ListTodo } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allPageTasks, setAllPageTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const response = await taskApi.getAll(params);
      setTasks(response.data || []);
      setAllPageTasks(response.data || []);
      if (response.meta) setMeta(response.meta);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleStatus = async (taskId: string) => {
    try {
      const response = await taskApi.toggleStatus(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? response.data! : t)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deletingTaskId) return;
    try {
      await taskApi.delete(deletingTaskId);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTaskId));
      setDeletingTaskId(null);
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
                Organize and track your work
              </p>
            </div>
            <button onClick={openCreate} className="btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>

          {/* Status summary cards */}
          <div className="mb-8">
            <StatusSummary
              tasks={allPageTasks}
              total={meta.total}
              activeFilter={statusFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <SearchBar value={search} onChange={setSearch} />
            <FilterDropdown value={statusFilter} onChange={handleFilterChange} />
          </div>

          {/* Active filters indicator */}
          {(debouncedSearch || statusFilter) && (
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

          {/* Task List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              <p className="text-sm text-surface-500">Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                <ListTodo className="h-8 w-8 text-surface-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-700">
                {debouncedSearch || statusFilter ? 'No matching tasks' : 'No tasks yet'}
              </h3>
              <p className="text-surface-500 mt-1 max-w-sm mx-auto">
                {debouncedSearch || statusFilter
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Create your first task to start organizing your work.'}
              </p>
              {!debouncedSearch && !statusFilter && (
                <button onClick={openCreate} className="btn-primary mt-6 inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Task
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggleStatus}
                  onEdit={openEdit}
                  onDelete={setDeletingTaskId}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={setPage}
          />
        </div>

        {/* Modals */}
        {showCreateModal && (
          <TaskFormModal
            task={editingTask}
            onClose={() => { setShowCreateModal(false); setEditingTask(null); }}
            onSubmit={handleCreateOrUpdate}
          />
        )}

        {deletingTaskId && (
          <DeleteConfirmModal
            onConfirm={handleDelete}
            onCancel={() => setDeletingTaskId(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
