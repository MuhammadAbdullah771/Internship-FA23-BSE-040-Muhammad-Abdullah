import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Paperclip, MessageSquare, BarChart2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { PRIORITY_COLORS } from '../constants';
import { cn } from '../utils';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchTaskBoard, updateTaskStatus } from '../services/taskService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';
import PageHeader from '../components/common/PageHeader';
import TaskFormModal from '../components/tasks/TaskFormModal';

const EMPTY_BOARD = { todo: [], inProgress: [], review: [], done: [] };

const STUDENT_STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Submit for Review' },
];

const ADMIN_STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'In Review' },
  { value: 'done', label: 'Completed' },
];

function TaskCard({ task, paths, isStudent, isSuperadmin, onStatusChange }) {
  const handleStatusChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = e.target.value;
    if (newStatus === task.status) return;
    const result = await onStatusChange(task.id, newStatus);
    if (!result.success) toast.error(result.error);
  };

  const statusOptions = isSuperadmin ? ADMIN_STATUS_OPTIONS : STUDENT_STATUS_OPTIONS;

  return (
    <div className="relative">
      <Link to={paths.taskDetail(task.id)}>
        <div className="task-card-premium rounded-2xl border p-4 cursor-pointer backdrop-blur-sm bg-white/90 border-slate-200/60">
          <Badge className={`mb-2.5 ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</Badge>
          <h3 className="font-bold text-sm mb-1 leading-snug text-slate-900">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs mb-3 line-clamp-2 leading-relaxed text-slate-500">
              {task.description}
            </p>
          )}
          {task.assigneeName && (
            <p className="text-xs mb-2 text-slate-400">{task.assigneeName}</p>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center">
              {task.assignee ? <Avatar src={task.assignee} size="sm" /> : null}
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
              <span className={task.dateUrgent ? 'text-red-500 font-semibold' : ''}>{task.date}</span>
              {task.attachments > 0 && (
                <span className="flex items-center gap-0.5"><Paperclip className="w-3 h-3" />{task.attachments}</span>
              )}
              {task.comments > 0 && (
                <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{task.comments}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
      {(isStudent || isSuperadmin) && (
        <select
          value={task.status === 'done' ? 'done' : task.status}
          onChange={handleStatusChange}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 text-[10px] font-semibold border rounded-lg px-2 py-1 shadow-sm border-slate-200/80 bg-white/90 text-slate-600"
          aria-label={`Change status for ${task.title}`}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}

function KanbanColumn({ title, items, count, paths, isStudent, isSuperadmin, onStatusChange, accent }) {
  return (
    <div className={cn('flex-1 min-w-[300px] kanban-column', accent)}>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-sm text-slate-900">{title}</h3>
        <span className="min-w-[1.75rem] h-7 px-2 rounded-full text-xs font-bold flex items-center justify-center shadow-sm bg-white/80 border border-slate-200/60 text-slate-600">
          {count}
        </span>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-xs text-center py-8 text-gray-400">No tasks</p>
        ) : (
          items.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              paths={paths}
              isStudent={isStudent}
              isSuperadmin={isSuperadmin}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function TaskManagement() {
  const [view, setView] = useState('board');
  const [modalOpen, setModalOpen] = useState(false);
  const { isSuperadmin, isStudent } = useAuth();
  const paths = useAppPaths();

  const { data: boardData, loading, refresh } = useRealtimePoll(fetchTaskBoard, { interval: 8000 });
  const board = boardData || EMPTY_BOARD;

  useRealtimeStream(['tasks:updated'], () => refresh(true));

  const handleStatusChange = useCallback(async (taskId, status) => {
    const result = await updateTaskStatus(taskId, status);
    if (result.success) {
      await refresh(true);
      toast.success(status === 'done' ? 'Task marked complete' : 'Task status updated');
    }
    return result;
  }, [refresh]);

  const allTasks = [
    ...(board.todo || []),
    ...(board.inProgress || []),
    ...(board.review || []),
    ...(board.done || []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isSuperadmin ? 'Task Management' : 'My Tasks'}
        subtitle={isSuperadmin
          ? 'Create, assign, and review tasks for Clerk students in real time.'
          : 'Tasks assigned to you by your superadmin. Update status and submit work here.'}
        actions={(
          <>
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={() => refresh(false)}
              disabled={loading}
            >
              Refresh
            </Button>
            {isSuperadmin && (
              <Link to={paths.PROGRESS}>
                <Button variant="outline" icon={BarChart2}>
                  Progress
                </Button>
              </Link>
            )}
            {isSuperadmin && (
              <Button className="!from-emerald-600 !to-teal-500" icon={Plus} onClick={() => setModalOpen(true)}>
                Create Task
              </Button>
            )}
          </>
        )}
      />

      <div className="flex items-center justify-end">
        <div className="flex border rounded-xl p-1 shadow-sm backdrop-blur-sm bg-white/70 border-slate-200/60">
          {['board', 'list'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                'px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all',
                view === v
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {loading && !boardData ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : view === 'board' ? (
        <div className="flex gap-5 overflow-x-auto pb-4">
          <KanbanColumn title="To Do" items={board.todo || []} count={(board.todo || []).length} paths={paths} isStudent={isStudent} isSuperadmin={isSuperadmin} onStatusChange={handleStatusChange} accent="kanban-column-todo" />
          <KanbanColumn title="In Progress" items={board.inProgress || []} count={(board.inProgress || []).length} paths={paths} isStudent={isStudent} isSuperadmin={isSuperadmin} onStatusChange={handleStatusChange} accent="kanban-column-progress" />
          <KanbanColumn title="Review" items={board.review || []} count={(board.review || []).length} paths={paths} isStudent={isStudent} isSuperadmin={isSuperadmin} onStatusChange={handleStatusChange} accent="kanban-column-review" />
          {isStudent && (
            <KanbanColumn title="Completed" items={board.done || []} count={(board.done || []).length} paths={paths} isStudent={isStudent} isSuperadmin={isSuperadmin} onStatusChange={handleStatusChange} accent="kanban-column-todo" />
          )}
        </div>
      ) : (
        <Card glass>
          <div className="space-y-3">
            {allTasks.length === 0 ? (
              <p className="text-center py-12 text-gray-500">
                No tasks yet. {isSuperadmin ? 'Create a task to get started.' : 'Wait for your admin to assign tasks.'}
              </p>
            ) : (
              allTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  paths={paths}
                  isStudent={isStudent}
                  isSuperadmin={isSuperadmin}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </Card>
      )}

      {isSuperadmin && (
        <TaskFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => refresh(true)}
        />
      )}
    </div>
  );
}
