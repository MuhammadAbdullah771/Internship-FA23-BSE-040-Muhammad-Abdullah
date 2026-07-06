import { z } from 'zod';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../constants/tasks.js';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(TASK_PRIORITIES).default('Medium'),
  status: z.enum(TASK_STATUSES).default('todo'),
  assigneeId: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable(),
  internId: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});

const submissionSchema = z.object({
  githubLink: z.string().trim().max(500).optional(),
  liveUrl: z.string().trim().max(500).optional(),
  comments: z.string().max(2000).optional(),
  submit: z.boolean().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  status: z.enum(TASK_STATUSES).optional(),
  assigneeId: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  submission: submissionSchema.optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' });

export const taskIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
});
