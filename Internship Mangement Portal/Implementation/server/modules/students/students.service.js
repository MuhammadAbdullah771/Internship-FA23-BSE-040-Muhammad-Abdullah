import { Task } from '../../models/Task.js';
import { Intern } from '../../models/Intern.js';
import { User } from '../../models/User.js';
import { InternshipApplication } from '../../models/InternshipApplication.js';
import { AppError } from '../../utils/AppError.js';
import { toTaskDTO } from '../../utils/taskSerializer.js';
import { toInternDTO } from '../../utils/internSerializer.js';

function buildCertificateStatus(progressPercent, intern) {
  if (progressPercent < 100) return 'locked';
  if (intern?.status === 'Completed') return 'verified';
  return 'pending';
}

export async function getStudentDashboard(userId) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

  const [intern, tasks, applicationCount] = await Promise.all([
    Intern.findOne({ userId }),
    Task.find({ assigneeId: userId }).sort({ dueDate: 1, createdAt: -1 }),
    InternshipApplication.countDocuments({ userId }),
  ]);

  const taskDtos = tasks.map(toTaskDTO);
  const total = taskDtos.length;
  const completed = taskDtos.filter((t) => t.status === 'done').length;
  const inProgress = taskDtos.filter((t) => t.status === 'in_progress').length;
  const todo = taskDtos.filter((t) => t.status === 'todo').length;
  const review = taskDtos.filter((t) => t.status === 'review').length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const now = new Date();
  const upcomingDeadlines = taskDtos
    .filter((t) => t.dueDate && t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recentTasks = taskDtos
    .filter((t) => t.status !== 'done')
    .slice(0, 5);

  const trackTitle = intern?.track
    || user.portalAccess?.internshipTitle
    || 'Internship';

  return {
    intern: intern ? toInternDTO(intern) : null,
    trackTitle,
    institute: user.portalAccess?.institute || '',
    cohort: intern?.intake ? `Cohort ${intern.intake}` : 'Internship Program',
    stats: {
      total,
      completed,
      inProgress,
      todo,
      review,
      progressPercent,
      applicationCount,
    },
    recentTasks,
    upcomingDeadlines,
    certificateStatus: buildCertificateStatus(progressPercent, intern),
    allTasks: taskDtos,
  };
}
