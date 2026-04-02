import { Router } from 'express';

const router = Router();

// GET    /tasks        - List tasks (paginated, filterable, searchable)
// POST   /tasks        - Create task
// GET    /tasks/:id    - Get single task
// PATCH  /tasks/:id    - Update task
// DELETE /tasks/:id    - Delete task
// PATCH  /tasks/:id/toggle - Toggle task status

export default router;
