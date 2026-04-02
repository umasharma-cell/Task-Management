import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { authGuard } from '../middleware/authGuard';
import { validate } from '../middleware/validate';
import { validateParams } from '../middleware/validateParams';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../utils/validation';

const router = Router();

// All task routes require authentication
router.use(authGuard);

router.get('/', TaskController.getAll);
router.post('/', validate(createTaskSchema), TaskController.create);
router.get('/:id', validateParams(taskIdSchema), TaskController.getById);
router.patch('/:id', validateParams(taskIdSchema), validate(updateTaskSchema), TaskController.update);
router.delete('/:id', validateParams(taskIdSchema), TaskController.delete);
router.patch('/:id/toggle', validateParams(taskIdSchema), TaskController.toggleStatus);

export default router;
