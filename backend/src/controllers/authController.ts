import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { env } from '../config/environment';

const authService = new AuthService();

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'strict' as const : 'lax' as const,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
}

function clearRefreshCookie(res: Response) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'strict' as const : 'lax' as const,
    path: '/api/auth',
  });
}

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    const result = await authService.register(email, name, password);

    setRefreshCookie(res, result.refreshToken);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    setRefreshCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token not found',
      });
      return;
    }

    const result = await authService.refresh(refreshToken);

    setRefreshCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    await authService.logout(authReq.user!.userId);

    clearRefreshCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  });
}
