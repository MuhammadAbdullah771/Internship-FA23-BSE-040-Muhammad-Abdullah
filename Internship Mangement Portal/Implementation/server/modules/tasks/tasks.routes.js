import { Router } from 'express';
import * as tasksController from './tasks.controller.js';
import { createTaskSchema, updateTaskSchema, taskIdParamSchema } from './tasks.validation.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, authorize } from '../../middleware/authenticate.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.SUPERADMIN, ROLES.STUDENT));

router.get('/', tasksController.list);
router.get('/:id', validate(taskIdParamSchema, 'params'), tasksController.getById);
router.post('/', authorize(ROLES.SUPERADMIN), validate(createTaskSchema), tasksController.create);
router.patch(
  '/:id',
  validate(taskIdParamSchema, 'params'),
  validate(updateTaskSchema),
  tasksController.update,
);
router.delete(
  '/:id',
  authorize(ROLES.SUPERADMIN),
  validate(taskIdParamSchema, 'params'),
  tasksController.remove,
);

export default router;
