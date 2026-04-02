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

    if (search && search.trim().length > 0) {
      where.title = { contains: search.trim(), mode: 'insensitive' };
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

  async create(data: {
    title: string;
    description?: string | null;
    priority?: string;
    dueDate?: string | null;
    userId: string;
  }): Promise<Task> {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        priority: (data.priority as Prisma.EnumTaskPriorityFieldUpdateOperationsInput['set']) ?? 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        user: { connect: { id: data.userId } },
      },
    });
  }

  async update(id: string, userId: string, data: Prisma.TaskUpdateInput): Promise<Task | null> {
    // Use a transaction to handle concurrent updates safely
    return prisma.$transaction(async (tx) => {
      const existing = await tx.task.findFirst({ where: { id, userId } });
      if (!existing) return null;

      return tx.task.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    });
  }

  async delete(id: string, userId: string): Promise<Task | null> {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.task.findFirst({ where: { id, userId } });
      if (!existing) return null;

      return tx.task.delete({ where: { id } });
    });
  }

  async toggleStatus(id: string, userId: string): Promise<Task | null> {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findFirst({ where: { id, userId } });
      if (!task) return null;

      const nextStatus: Record<TaskStatus, TaskStatus> = {
        PENDING: 'IN_PROGRESS',
        IN_PROGRESS: 'COMPLETED',
        COMPLETED: 'PENDING',
      };

      return tx.task.update({
        where: { id },
        data: { status: nextStatus[task.status] },
      });
    });
  }
}
