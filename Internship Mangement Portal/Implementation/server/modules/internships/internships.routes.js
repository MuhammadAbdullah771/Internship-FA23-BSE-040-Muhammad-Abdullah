import { Router } from 'express';
import * as internshipsController from './internships.controller.js';
import {
  listPostingsQuerySchema,
  postingIdParamSchema,
  createPostingSchema,
} from './internships.validation.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

router.get('/', validate(listPostingsQuerySchema, 'query'), internshipsController.list);
router.get(
  '/my-applications',
  authenticate,
  authorize(ROLES.STUDENT),
  internshipsController.myApplications,
);
router.get('/:id', validate(postingIdParamSchema, 'params'), internshipsController.getById);
router.post(
  '/:id/apply',
  authenticate,
  authorize(ROLES.STUDENT),
  validate(postingIdParamSchema, 'params'),
  internshipsController.apply,
);
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPERADMIN),
  validate(createPostingSchema),
  internshipsController.create,
);

export default router;
