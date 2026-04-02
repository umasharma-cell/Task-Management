import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { authGuard } from '../middleware/authGuard';
import { authLimiter } from '../middleware/rateLimiter';
import { registerSchema, loginSchema, refreshSchema } from '../utils/validation';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshSchema), AuthController.refresh);
router.post('/logout', authGuard, AuthController.logout);

export default router;
