import { z } from 'zod';

export const listPostingsQuerySchema = z.object({
  trending: z.enum(['true', 'false']).optional().transform((v) => v === 'true'),
});

export const postingIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
});

export const createPostingSchema = z.object({
  title: z.string().trim().min(1),
  company: z.string().trim().optional(),
  duration: z.string().trim().min(1),
  type: z.string().trim().default('Virtual'),
  spots: z.coerce.number().int().min(0).default(20),
  level: z.string().trim().default('Beginner'),
  image: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  trending: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
