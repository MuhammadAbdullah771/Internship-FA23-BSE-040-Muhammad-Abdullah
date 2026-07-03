import { Router } from 'express';
import * as internsController from './interns.controller.js';
import {
  createInternSchema,
  updateInternSchema,
  listInternsQuerySchema,
  internIdParamSchema,
} from './interns.validation.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.SUPERADMIN));

router.get('/stats', internsController.stats);
router.get('/filters', internsController.filters);
router.get('/', validate(listInternsQuerySchema, 'query'), internsController.list);
router.get('/:id', validate(internIdParamSchema, 'params'), internsController.getById);
router.post('/', validate(createInternSchema), internsController.create);
router.patch(
  '/:id',
  validate(internIdParamSchema, 'params'),
  validate(updateInternSchema),
  internsController.update,
);
router.delete('/:id', validate(internIdParamSchema, 'params'), internsController.remove);

export default router;
