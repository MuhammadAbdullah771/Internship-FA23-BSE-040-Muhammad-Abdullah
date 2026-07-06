import { Router } from 'express';
import * as studentsController from './students.controller.js';
import { authenticate, authorize } from '../../middleware/authenticate.js';
import { ROLES } from '../../constants/roles.js';

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.STUDENT));

router.get('/dashboard', studentsController.dashboard);

export default router;
