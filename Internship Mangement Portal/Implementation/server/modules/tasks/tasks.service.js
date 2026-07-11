import { Task } from '../../models/Task.js';
import { ROLES } from '../../constants/roles.js';
import { AppError } from '../../utils/AppError.js';
import { toTaskDTO, toKanbanBoard } from '../../utils/taskSerializer.js';
import { broadcastToRole, broadcastToUser } from '../events/eventBus.js';

async function populateQuery(query) {
  return query.populate({ path: 'assigneeId', select: 'firstName lastName avatar email' });
}

function notifyTaskUpdate(task) {
  const taskId = task._id?.toString?.() || task.id;
  const assigneeId = task.assigneeId?._id?.toString?.()
    || task.assigneeId?.toString?.()
    || null;

  broadcastToRole(ROLES.SUPERADMIN, 'tasks:updated', { taskId });
  if (assigneeId) {
    broadcastToUser(assigneeId, 'tasks:updated', { taskId });
  }
}

export async function listTasks(user) {
  if (user.role === ROLES.STUDENT) {
    const tasks = await populateQuery(
      Task.find({ assigneeId: user._id }).sort({ createdAt: -1 }),
    );
    const dtos = tasks.map(toTaskDTO);
    return {
      todo: dtos.filter((t) => t.status === 'todo'),
      inProgress: dtos.filter((t) => t.status === 'in_progress'),
      review: dtos.filter((t) => t.status === 'review'),
      done: dtos.filter((t) => t.status === 'done'),
    };
  }

  const tasks = await populateQuery(Task.find({ status: { $ne: 'done' } }).sort({ createdAt: -1 }));
  return toKanbanBoard(tasks);
}

export async function getTaskById(id, user) {
  const task = await populateQuery(Task.findById(id));
  if (!task) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');

  if (user.role === ROLES.STUDENT && task.assigneeId?._id?.toString() !== user._id.toString()) {
    throw new AppError('Access denied', 403, 'FORBIDDEN');
  }

  return toTaskDTO(task);
}

export async function createTask(payload, createdBy) {
  const task = await Task.create({ ...payload, createdBy: createdBy._id });
  const populated = await populateQuery(Task.findById(task._id));
  notifyTaskUpdate(populated);
  return toTaskDTO(populated);
}

export async function updateTask(id, payload, user) {
  const task = await Task.findById(id);
  if (!task) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');

  if (user.role === ROLES.STUDENT) {
    if (task.assigneeId?.toString() !== user._id.toString()) {
      throw new AppError('Access denied', 403, 'FORBIDDEN');
    }

    if (payload.status) {
      task.status = payload.status;
    }

    if (payload.submission) {
      const { githubLink, liveUrl, comments, submit } = payload.submission;
      if (!task.submission) task.submission = {};

      if (githubLink !== undefined) task.submission.githubLink = githubLink;
      if (liveUrl !== undefined) task.submission.liveUrl = liveUrl;
      if (comments !== undefined) task.submission.comments = comments;

      if (submit) {
        const link = task.submission.githubLink?.trim();
        if (!link) {
          throw new AppError('GitHub link is required to submit', 400, 'GITHUB_REQUIRED');
        }
        task.submission.status = 'submitted';
        task.submission.submittedAt = new Date();
        task.status = 'review';
      } else if (githubLink !== undefined || liveUrl !== undefined || comments !== undefined) {
        task.submission.status = 'draft';
      }
    }
  } else {
    Object.assign(task, payload);
  }

  await task.save();
  const populated = await populateQuery(Task.findById(task._id));
  notifyTaskUpdate(populated);
  return toTaskDTO(populated);
}

export async function deleteTask(id) {
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
  notifyTaskUpdate(task);
  return { message: 'Task deleted' };
}
