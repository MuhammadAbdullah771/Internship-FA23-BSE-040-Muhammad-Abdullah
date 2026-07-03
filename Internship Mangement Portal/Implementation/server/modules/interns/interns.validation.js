import { z } from 'zod';
import { INTERN_STATUSES, INTERN_DEPARTMENTS, MAX_PAGE_LIMIT } from '../../constants/interns.js';

const internFields = {
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().email('Enter a valid email').transform((v) => v.toLowerCase().trim()),
  track: z.string().trim().min(1, 'Track/role is required').max(120),
  department: z.enum(INTERN_DEPARTMENTS, { message: 'Invalid department' }),
  intake: z.string().trim().min(4, 'Intake year is required').max(10),
  status: z.enum(INTERN_STATUSES).optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID').optional().nullable(),
};

export const createInternSchema = z.object({
  ...internFields,
  status: z.enum(INTERN_STATUSES).default('Onboarding'),
});

export const updateInternSchema = z.object({
  firstName: internFields.firstName.optional(),
  lastName: internFields.lastName.optional(),
  email: internFields.email.optional(),
  track: internFields.track.optional(),
  department: internFields.department.optional(),
  intake: internFields.intake.optional(),
  status: z.enum(INTERN_STATUSES).optional(),
  avatar: internFields.avatar,
  userId: internFields.userId,
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required to update',
});

export const listInternsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_LIMIT).default(10),
  search: z.string().trim().optional().transform((v) => v || undefined),
  department: z.string().optional().transform((v) => (
    v && INTERN_DEPARTMENTS.includes(v) ? v : undefined
  )),
  status: z.string().optional().transform((v) => (
    v && INTERN_STATUSES.includes(v) ? v : undefined
  )),
  intake: z.string().trim().optional().transform((v) => v || undefined),
});

export const internIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid intern ID'),
});
