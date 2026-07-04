import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../../models/User.js';
import { InternshipPosting } from '../../models/InternshipPosting.js';
import { ROLES } from '../../constants/roles.js';
import { AppError } from '../../utils/AppError.js';
import { toUserDTO } from '../../utils/userSerializer.js';
import { env } from '../../config/env.js';

const uploadsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../uploads/payments',
);

async function ensureUploadsDir() {
  await fs.mkdir(uploadsDir, { recursive: true });
}

function mapApplicationUser(user) {
  const dto = toUserDTO(user);
  return {
    ...dto,
    portalAccess: {
      status: user.portalAccess?.status || 'unsubmitted',
      internshipTitle: user.portalAccess?.internshipTitle || '',
      postingId: user.portalAccess?.postingId?.toString() || null,
      paymentScreenshot: user.portalAccess?.paymentScreenshot || '',
      notes: user.portalAccess?.notes || '',
      submittedAt: user.portalAccess?.submittedAt || null,
      reviewedAt: user.portalAccess?.reviewedAt || null,
      rejectionReason: user.portalAccess?.rejectionReason || '',
    },
  };
}

async function savePaymentScreenshot(dataUrl, userId) {
  const match = /^data:image\/(png|jpe?g|webp);base64,(.+)$/i.exec(dataUrl);
  if (!match) {
    throw new AppError('Payment screenshot must be a PNG, JPG, or WebP image', 400, 'INVALID_IMAGE');
  }

  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');

  if (buffer.length > 5 * 1024 * 1024) {
    throw new AppError('Payment screenshot must be under 5MB', 400, 'IMAGE_TOO_LARGE');
  }

  await ensureUploadsDir();
  const filename = `${userId}-${Date.now()}.${ext}`;
  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, buffer);

  return `/uploads/payments/${filename}`;
}

export function assertPortalApproved(user) {
  if (user.role === ROLES.SUPERADMIN) return;
  if (user.portalAccess?.status !== 'approved') {
    throw new AppError('Portal access pending superadmin approval', 403, 'PORTAL_ACCESS_DENIED');
  }
}

export async function getMyPortalAccess(userId) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return mapApplicationUser(user);
}

export async function submitPortalAccess(userId, { postingId, notes, paymentScreenshot }) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  if (user.role !== ROLES.STUDENT) {
    throw new AppError('Only students can submit portal access requests', 403, 'FORBIDDEN');
  }
  if (user.portalAccess?.status === 'pending') {
    throw new AppError('Your application is already under review', 409, 'ALREADY_PENDING');
  }
  if (user.portalAccess?.status === 'approved') {
    throw new AppError('Your portal access is already approved', 409, 'ALREADY_APPROVED');
  }

  const posting = await InternshipPosting.findById(postingId);
  if (!posting) throw new AppError('Internship not found', 404, 'POSTING_NOT_FOUND');

  const screenshotPath = await savePaymentScreenshot(paymentScreenshot, userId);

  user.portalAccess = {
    status: 'pending',
    postingId: posting._id,
    internshipTitle: posting.title,
    paymentScreenshot: screenshotPath,
    notes: notes?.trim() || '',
    submittedAt: new Date(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: '',
  };

  await user.save();
  return mapApplicationUser(user);
}

export async function listPendingApplications() {
  const users = await User.find({
    role: ROLES.STUDENT,
    'portalAccess.status': 'pending',
  })
    .sort({ 'portalAccess.submittedAt': -1 })
    .populate('portalAccess.postingId', 'title level duration');

  return users.map(mapApplicationUser);
}

export async function reviewPortalAccess(adminId, studentId, { action, rejectionReason }) {
  const user = await User.findById(studentId);
  if (!user) throw new AppError('Student not found', 404, 'USER_NOT_FOUND');
  if (user.portalAccess?.status !== 'pending') {
    throw new AppError('This application is not pending review', 400, 'NOT_PENDING');
  }

  if (action === 'approve') {
    user.portalAccess.status = 'approved';
    user.portalAccess.rejectionReason = '';
  } else {
    user.portalAccess.status = 'rejected';
    user.portalAccess.rejectionReason = rejectionReason?.trim() || 'Application rejected by admin.';
  }

  user.portalAccess.reviewedAt = new Date();
  user.portalAccess.reviewedBy = adminId;
  await user.save();

  return mapApplicationUser(user);
}
