import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/authenticate.js';
import { ROLES } from '../../constants/roles.js';
import * as adminController from './admin.controller.js';

const router = Router();

router.get(
  '/dashboard',
  authenticate,
  authorize(ROLES.SUPERADMIN),
  adminController.dashboard,
);

router.get(
  '/students',
  authenticate,
  authorize(ROLES.SUPERADMIN),
  adminController.students,
);

router.get(
  '/reports',
  authenticate,
  authorize(ROLES.SUPERADMIN),
  adminController.reports,
);

export default router;
