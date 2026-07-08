import { Intern } from '../../models/Intern.js';
import { AppError } from '../../utils/AppError.js';
import { toInternDTO } from '../../utils/internSerializer.js';
import { broadcastToRole } from '../events/eventBus.js';

function buildListFilter({ search, department, status, intake }) {
  const filter = {};

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { track: regex },
    ];
  }

  if (department) filter.department = department;
  if (status) filter.status = status;
  if (intake) filter.intake = intake;

  return filter;
}

function buildAvatar(email) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
}

export async function listInterns(query) {
  const { page, limit, search, department, status, intake } = query;
  const filter = buildListFilter({ search, department, status, intake });
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Intern.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Intern.countDocuments(filter),
  ]);

  return {
    interns: items.map(toInternDTO),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getInternStats() {
  const [statusCounts, departmentCounts, total] = await Promise.all([
    Intern.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Intern.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]),
    Intern.countDocuments(),
  ]);

  const byStatus = Object.fromEntries(statusCounts.map((s) => [s._id, s.count]));

  return {
    total,
    active: byStatus.Active ?? 0,
    onboarding: byStatus.Onboarding ?? 0,
    completed: byStatus.Completed ?? 0,
    byDepartment: departmentCounts.map((d) => ({
      department: d._id,
      count: d.count,
    })),
  };
}

export async function getInternById(id) {
  const intern = await Intern.findById(id);
  if (!intern) {
    throw new AppError('Intern not found', 404, 'INTERN_NOT_FOUND');
  }
  return toInternDTO(intern);
}

export async function createIntern(payload) {
  const existing = await Intern.findOne({ email: payload.email });
  if (existing) {
    throw new AppError('An intern with this email already exists', 409, 'EMAIL_EXISTS');
  }

  const intern = await Intern.create({
    ...payload,
    avatar: payload.avatar || buildAvatar(payload.email),
  });

  broadcastToRole('superadmin', 'interns:updated', { action: 'created' });
  return toInternDTO(intern);
}

export async function updateIntern(id, payload) {
  const intern = await Intern.findById(id);
  if (!intern) {
    throw new AppError('Intern not found', 404, 'INTERN_NOT_FOUND');
  }

  if (payload.email && payload.email !== intern.email) {
    const duplicate = await Intern.findOne({ email: payload.email });
    if (duplicate) {
      throw new AppError('An intern with this email already exists', 409, 'EMAIL_EXISTS');
    }
  }

  Object.assign(intern, payload);
  await intern.save();

  broadcastToRole('superadmin', 'interns:updated', { action: 'updated', internId: id });
  return toInternDTO(intern);
}

export async function deleteIntern(id) {
  const intern = await Intern.findByIdAndDelete(id);
  if (!intern) {
    throw new AppError('Intern not found', 404, 'INTERN_NOT_FOUND');
  }
  broadcastToRole('superadmin', 'interns:updated', { action: 'deleted', internId: id });
  return { message: 'Intern deleted successfully' };
}

export async function getFilterOptions() {
  const [departments, statuses, intakes] = await Promise.all([
    Intern.distinct('department'),
    Intern.distinct('status'),
    Intern.distinct('intake'),
  ]);

  return {
    departments: departments.sort(),
    statuses: statuses.sort(),
    intakes: intakes.sort((a, b) => b.localeCompare(a)),
  };
}
