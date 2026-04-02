import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';

const taskService = new TaskService();

export class TaskController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { tasks, meta } = await taskService.getAll(
      authReq.user!.userId,
      req.query as Record<string, string>
    );

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
      meta,
    });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const task = await taskService.getById(req.params.id, authReq.user!.userId);

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const task = await taskService.create(authReq.user!.userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const task = await taskService.update(req.params.id, authReq.user!.userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    await taskService.delete(req.params.id, authReq.user!.userId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  });

  static toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const task = await taskService.toggleStatus(req.params.id, authReq.user!.userId);

    res.status(200).json({
      success: true,
      message: 'Task status toggled successfully',
      data: task,
    });
  });
}
