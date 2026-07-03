function formatDueDate(dueDate) {
  if (!dueDate) return 'No date';
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Due Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 0) return 'Overdue';

  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function toTaskDTO(task) {
  const assignee = task.assigneeId;
  const avatar = assignee?.avatar || null;

  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    assignee: avatar,
    assignees: avatar ? [avatar] : [],
    date: formatDueDate(task.dueDate),
    dateUrgent: task.dueDate && formatDueDate(task.dueDate) === 'Due Today',
    attachments: task.attachments,
    comments: task.comments,
    dueDate: task.dueDate,
    assigneeId: task.assigneeId?._id?.toString() ?? task.assigneeId?.toString() ?? null,
    assigneeName: assignee?.fullName ?? assignee?.firstName
      ? `${assignee.firstName} ${assignee.lastName}`.trim()
      : null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export function toKanbanBoard(tasks) {
  const dtos = tasks.map(toTaskDTO);
  return {
    todo: dtos.filter((t) => t.status === 'todo'),
    inProgress: dtos.filter((t) => t.status === 'in_progress'),
    review: dtos.filter((t) => t.status === 'review'),
  };
}
