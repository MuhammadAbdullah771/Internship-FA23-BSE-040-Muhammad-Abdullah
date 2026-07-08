import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from './auth.controller.js';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from './auth.validation.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'RATE_LIMITED',
    message: 'Too many attempts. Please try again later.',
  },
});

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authLimiter, validate(refreshSchema), authController.refresh);
router.post('/logout', authLimiter, validate(refreshSchema), authController.logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);

router.get('/me', authenticate, authController.me);
router.patch('/me', authenticate, validate(updateProfileSchema), authController.updateMe);
router.post('/me/sync-clerk-avatar', authenticate, authController.syncClerkAvatar);

export default router;
