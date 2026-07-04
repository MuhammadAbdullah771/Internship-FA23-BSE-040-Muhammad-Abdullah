import { InternshipPosting } from '../../models/InternshipPosting.js';
import { InternshipApplication } from '../../models/InternshipApplication.js';
import { User } from '../../models/User.js';
import { AppError } from '../../utils/AppError.js';
import { assertPortalApproved } from '../portal-access/portal-access.service.js';
import { toPostingDTO, toApplicationDTO } from '../../utils/internshipSerializer.js';

export async function listPostings({ trending } = {}) {
  const filter = { isActive: true };
  if (trending) filter.trending = true;

  const postings = await InternshipPosting.find(filter).sort({ trending: -1, createdAt: -1 });
  return postings.map(toPostingDTO);
}

export async function getPostingById(id) {
  const posting = await InternshipPosting.findOne({ _id: id, isActive: true });
  if (!posting) throw new AppError('Internship not found', 404, 'POSTING_NOT_FOUND');
  return toPostingDTO(posting);
}

export async function applyToPosting(postingId, userId) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  assertPortalApproved(user);

  const posting = await InternshipPosting.findOne({ _id: postingId, isActive: true });
  if (!posting) throw new AppError('Internship not found', 404, 'POSTING_NOT_FOUND');

  const existing = await InternshipApplication.findOne({ userId, postingId });
  if (existing) {
    throw new AppError('You have already applied to this internship', 409, 'ALREADY_APPLIED');
  }

  const application = await InternshipApplication.create({ userId, postingId });
  return {
    message: `Application submitted for ${posting.title}`,
    application: toApplicationDTO(application),
  };
}

export async function getMyApplications(userId) {
  const applications = await InternshipApplication.find({ userId })
    .populate('postingId')
    .sort({ createdAt: -1 });

  return applications.map((app) => toApplicationDTO(app));
}

export async function createPosting(payload) {
  const posting = await InternshipPosting.create(payload);
  return toPostingDTO(posting);
}
