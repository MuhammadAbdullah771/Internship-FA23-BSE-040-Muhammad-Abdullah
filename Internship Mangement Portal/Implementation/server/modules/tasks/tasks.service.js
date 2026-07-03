import { Task } from '../../models/Task.js';
import { ROLES } from '../../constants/roles.js';
import { AppError } from '../../utils/AppError.js';
import { toTaskDTO, toKanbanBoard } from '../../utils/taskSerializer.js';

async function populateQuery(query) {
  return query.populate({ path: 'assigneeId', select: 'firstName lastName avatar email' });
}

export async function listTasks(user) {
  const filter = user.role === ROLES.STUDENT
    ? { assigneeId: user._id, status: { $ne: 'done' } }
    : { status: { $ne: 'done' } };

  const tasks = await populateQuery(Task.find(filter).sort({ createdAt: -1 }));
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
  return toTaskDTO(populated);
}

export async function updateTask(id, payload, user) {
  const task = await Task.findById(id);
  if (!task) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');

  if (user.role === ROLES.STUDENT) {
    if (task.assigneeId?.toString() !== user._id.toString()) {
      throw new AppError('Access denied', 403, 'FORBIDDEN');
    }
    const allowed = { status: payload.status };
    Object.assign(task, allowed);
  } else {
    Object.assign(task, payload);
  }

  await task.save();
  const populated = await populateQuery(Task.findById(task._id));
  return toTaskDTO(populated);
}

export async function deleteTask(id) {
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
  return { message: 'Task deleted' };
}
