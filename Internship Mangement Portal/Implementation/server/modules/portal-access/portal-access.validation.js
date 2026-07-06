import { z } from 'zod';

const cnicRegex = /^(\d{5}-\d{7}-\d|\d{13})$/;
const phoneRegex = /^(\+92|0)?3\d{9}$/;

export const submitPortalAccessSchema = z.object({
  postingId: z.string().min(1, 'Select an internship'),
  fullName: z.string().trim().min(2, 'Full name is required').max(120),
  fatherName: z.string().trim().min(2, 'Father name is required').max(120),
  institute: z.string().trim().min(2, 'Institute name is required').max(200),
  cnic: z.string().trim().regex(cnicRegex, 'Enter a valid CNIC (e.g. 12345-1234567-1)'),
  contactNumber: z.string().trim().regex(phoneRegex, 'Enter a valid Pakistani contact number'),
  notes: z.string().max(1000).optional(),
  cvPdf: z.string().min(1, 'CV in PDF format is required'),
  paymentScreenshot: z.string().min(1, 'Payment screenshot is required'),
});

export const reviewPortalAccessSchema = z.object({
  action: z.enum(['approve', 'reject']),
  rejectionReason: z.string().max(500).optional(),
});

export const studentIdParamSchema = z.object({
  studentId: z.string().min(1),
});
