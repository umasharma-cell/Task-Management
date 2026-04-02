import { Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { AuthenticatedRequest } from '../types';

const taskService = new TaskService();

export class TaskController {
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { tasks, meta } = await taskService.getAll(req.user!.userId, req.query as Record<string, string>);

      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
        meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = await taskService.getById(req.params.id, req.user!.userId);

      res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = await taskService.create(req.user!.userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = await taskService.update(req.params.id, req.user!.userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await taskService.delete(req.params.id, req.user!.userId);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const task = await taskService.toggleStatus(req.params.id, req.user!.userId);

      res.status(200).json({
        success: true,
        message: 'Task status toggled successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }
}
