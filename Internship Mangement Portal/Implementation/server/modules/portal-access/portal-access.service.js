import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../../models/User.js';
import { InternshipPosting } from '../../models/InternshipPosting.js';
import { ROLES } from '../../constants/roles.js';
import { AppError } from '../../utils/AppError.js';
import { toUserDTO } from '../../utils/userSerializer.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const paymentsDir = path.resolve(moduleDir, '../../uploads/payments');
const cvsDir = path.resolve(moduleDir, '../../uploads/cvs');

function mapPortalAccessFields(portalAccess = {}) {
  return {
    status: portalAccess.status || 'unsubmitted',
    internshipTitle: portalAccess.internshipTitle || '',
    postingId: portalAccess.postingId?.toString() || null,
    fullName: portalAccess.fullName || '',
    fatherName: portalAccess.fatherName || '',
    institute: portalAccess.institute || '',
    cnic: portalAccess.cnic || '',
    contactNumber: portalAccess.contactNumber || '',
    cvPdf: portalAccess.cvPdf || '',
    paymentScreenshot: portalAccess.paymentScreenshot || '',
    notes: portalAccess.notes || '',
    submittedAt: portalAccess.submittedAt || null,
    reviewedAt: portalAccess.reviewedAt || null,
    rejectionReason: portalAccess.rejectionReason || '',
  };
}

function mapApplicationUser(user) {
  const dto = toUserDTO(user);
  return {
    ...dto,
    portalAccess: mapPortalAccessFields(user.portalAccess),
  };
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
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

  await ensureDir(paymentsDir);
  const filename = `${userId}-payment-${Date.now()}.${ext}`;
  await fs.writeFile(path.join(paymentsDir, filename), buffer);

  return `/uploads/payments/${filename}`;
}

async function saveCvPdf(dataUrl, userId) {
  const match = /^data:application\/pdf;base64,(.+)$/i.exec(dataUrl);
  if (!match) {
    throw new AppError('CV must be uploaded as a PDF file', 400, 'INVALID_PDF');
  }

  const buffer = Buffer.from(match[1], 'base64');

  if (buffer.length > 5 * 1024 * 1024) {
    throw new AppError('CV must be under 5MB', 400, 'PDF_TOO_LARGE');
  }

  const header = buffer.subarray(0, 4).toString('utf8');
  if (!header.startsWith('%PDF')) {
    throw new AppError('CV must be a valid PDF file', 400, 'INVALID_PDF');
  }

  await ensureDir(cvsDir);
  const filename = `${userId}-cv-${Date.now()}.pdf`;
  await fs.writeFile(path.join(cvsDir, filename), buffer);

  return `/uploads/cvs/${filename}`;
}

function normalizeCnic(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 13) return value.trim();
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
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

export async function submitPortalAccess(userId, payload) {
  const {
    postingId,
    fullName,
    fatherName,
    institute,
    cnic,
    contactNumber,
    notes,
    cvPdf,
    paymentScreenshot,
  } = payload;

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

  const [cvPath, screenshotPath] = await Promise.all([
    saveCvPdf(cvPdf, userId),
    savePaymentScreenshot(paymentScreenshot, userId),
  ]);

  user.portalAccess = {
    status: 'pending',
    postingId: posting._id,
    internshipTitle: posting.title,
    fullName: fullName.trim(),
    fatherName: fatherName.trim(),
    institute: institute.trim(),
    cnic: normalizeCnic(cnic),
    contactNumber: contactNumber.trim(),
    cvPdf: cvPath,
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
