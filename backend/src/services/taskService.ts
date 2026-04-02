import { TaskStatus } from '@prisma/client';
import { TaskRepository } from '../repositories/taskRepository';
import { ApiError } from '../utils/apiError';
import { CreateTaskInput, UpdateTaskInput } from '../utils/validation';

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 10;

export class TaskService {
  private taskRepo: TaskRepository;

  constructor() {
    this.taskRepo = new TaskRepository();
  }

  async getAll(
    userId: string,
    query: { page?: string; limit?: string; status?: string; search?: string }
  ) {
    const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(query.limit || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE));

    let status: TaskStatus | undefined;
    if (query.status) {
      const upper = query.status.toUpperCase();
      if (!['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(upper)) {
        throw ApiError.badRequest('Invalid status filter. Must be PENDING, IN_PROGRESS, or COMPLETED');
      }
      status = upper as TaskStatus;
    }

    const search = query.search?.trim() || undefined;

    const { tasks, total } = await this.taskRepo.findAll({ userId, page, limit, status, search });
    const totalPages = Math.ceil(total / limit);

    // Pagination overflow: return empty array with correct meta instead of error
    return {
      tasks,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getById(taskId: string, userId: string) {
    const task = await this.taskRepo.findById(taskId, userId);
    if (!task) {
      throw ApiError.notFound('Task not found');
    }
    return task;
  }

  async create(userId: string, data: CreateTaskInput) {
    return this.taskRepo.create({
      title: data.title,
      description: data.description ?? null,
      priority: data.priority,
      dueDate: data.dueDate ?? null,
      userId,
    });
  }

  async update(taskId: string, userId: string, data: UpdateTaskInput) {
    if (Object.keys(data).length === 0) {
      throw ApiError.badRequest('No fields provided to update');
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

    const task = await this.taskRepo.update(taskId, userId, updateData);
    if (!task) {
      throw ApiError.notFound('Task not found');
    }
    return task;
  }

  async delete(taskId: string, userId: string) {
    const task = await this.taskRepo.delete(taskId, userId);
    if (!task) {
      throw ApiError.notFound('Task not found');
    }
    return task;
  }

  async toggleStatus(taskId: string, userId: string) {
    const task = await this.taskRepo.toggleStatus(taskId, userId);
    if (!task) {
      throw ApiError.notFound('Task not found');
    }
    return task;
  }
}
