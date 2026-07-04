import { Router } from 'express';
import * as portalAccessController from './portal-access.controller.js';
import {
  submitPortalAccessSchema,
  reviewPortalAccessSchema,
  studentIdParamSchema,
} from './portal-access.validation.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, authorize } from '../../middleware/authenticate.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

router.get(
  '/me',
  authenticate,
  authorize(ROLES.STUDENT),
  portalAccessController.getMine,
);

router.post(
  '/submit',
  authenticate,
  authorize(ROLES.STUDENT),
  validate(submitPortalAccessSchema),
  portalAccessController.submit,
);

router.get(
  '/pending',
  authenticate,
  authorize(ROLES.SUPERADMIN),
  portalAccessController.listPending,
);

router.patch(
  '/:studentId/review',
  authenticate,
  authorize(ROLES.SUPERADMIN),
  validate(studentIdParamSchema, 'params'),
  validate(reviewPortalAccessSchema),
  portalAccessController.review,
);

export default router;
