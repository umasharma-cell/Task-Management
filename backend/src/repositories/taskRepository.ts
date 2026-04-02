import prisma from '../config/database';
import { Task, TaskStatus, Prisma } from '@prisma/client';

interface FindAllParams {
  userId: string;
  page: number;
  limit: number;
  status?: TaskStatus;
  search?: string;
}

export class TaskRepository {
  async findAll({ userId, page, limit, status, search }: FindAllParams) {
    const where: Prisma.TaskWhereInput = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total };
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    return prisma.task.findFirst({ where: { id, userId } });
  }

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return prisma.task.create({ data });
  }

  async update(id: string, userId: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Task> {
    return prisma.task.delete({ where: { id, userId } });
  }

  async toggleStatus(id: string, userId: string): Promise<Task> {
    const task = await this.findById(id, userId);
    if (!task) throw new Error('Task not found');

    const nextStatus: Record<TaskStatus, TaskStatus> = {
      PENDING: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'PENDING',
    };

    return prisma.task.update({
      where: { id },
      data: { status: nextStatus[task.status] },
    });
  }
}
