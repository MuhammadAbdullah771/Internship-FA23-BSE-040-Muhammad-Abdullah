import { z } from 'zod';
import { ROLE_VALUES } from '../../constants/roles.js';

const emailSchema = z.string().email('Enter a valid email').transform((v) => v.toLowerCase().trim());
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(128);

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  expectedRole: z.enum(ROLE_VALUES).optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(80).optional(),
  lastName: z.string().trim().min(1).max(80).optional(),
  contactNumber: z.string().trim().max(20).optional(),
  avatar: z.string().max(6_000_000).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' });
