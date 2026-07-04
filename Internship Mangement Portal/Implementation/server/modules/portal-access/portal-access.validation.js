import { z } from 'zod';

export const submitPortalAccessSchema = z.object({
  postingId: z.string().min(1, 'Select an internship'),
  notes: z.string().max(1000).optional(),
  paymentScreenshot: z.string().min(1, 'Payment screenshot is required'),
});

export const reviewPortalAccessSchema = z.object({
  action: z.enum(['approve', 'reject']),
  rejectionReason: z.string().max(500).optional(),
});

export const studentIdParamSchema = z.object({
  studentId: z.string().min(1),
});
