import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';

const authService = new AuthService();

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    const result = await authService.register(email, name, password);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: result,
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result,
    });
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: result,
    });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    await authService.logout(authReq.user!.userId);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  });
}
