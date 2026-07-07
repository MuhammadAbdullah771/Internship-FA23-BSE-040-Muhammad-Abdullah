import { useEffect, useState, useCallback } from 'react';
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
import PageHeader from '../components/common/PageHeader';

const EMPTY_BOARD = { todo: [], inProgress: [], review: [] };

const STUDENT_STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Submit for Review' },
];

function TaskCard({ task, paths, isStudent, onStatusChange }) {
  const handleStatusChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = e.target.value;
    if (newStatus === task.status) return;
    const result = await onStatusChange(task.id, newStatus);
    if (!result.success) toast.error(result.error);
  };

  return (
    <div className="relative">
      <Link to={paths.taskDetail(task.id)}>
        <div className="task-card-premium bg-white/90 rounded-2xl border border-slate-200/60 p-4 cursor-pointer backdrop-blur-sm">
          <Badge className={`mb-2.5 ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</Badge>
          <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{task.title}</h3>
          {task.description && (
            <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center">
              {task.assignee ? <Avatar src={task.assignee} size="sm" /> : null}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
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
      {isStudent && (
        <select
          value={task.status}
          onChange={handleStatusChange}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 text-[10px] font-semibold border border-slate-200/80 rounded-lg px-2 py-1 bg-white/90 text-slate-600 shadow-sm backdrop-blur-sm"
          aria-label={`Change status for ${task.title}`}
        >
          {STUDENT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}

function KanbanColumn({ title, items, count, paths, isStudent, onStatusChange, accent }) {
  return (
    <div className={cn('flex-1 min-w-[300px] kanban-column', accent)}>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        <span className="min-w-[1.75rem] h-7 px-2 rounded-full bg-white/80 border border-slate-200/60 text-xs font-bold text-slate-600 flex items-center justify-center shadow-sm">
          {count}
        </span>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">No tasks</p>
        ) : (
          items.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              paths={paths}
              isStudent={isStudent}
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
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [loading, setLoading] = useState(true);
  const { isSuperadmin, isStudent } = useAuth();
  const paths = useAppPaths();

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTaskBoard();
      setBoard(data);
    } catch {
      toast.error('Failed to load tasks');
      setBoard(EMPTY_BOARD);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleStatusChange = useCallback(async (taskId, status) => {
    const result = await updateTaskStatus(taskId, status);
    if (result.success) {
      await loadTasks();
      toast.success('Task status updated');
    }
    return result;
  }, [loadTasks]);

  const allTasks = [...board.todo, ...board.inProgress, ...board.review];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isSuperadmin ? 'Task Management' : 'My Tasks'}
        subtitle={isSuperadmin ? 'Manage and track intern assignments across the program.' : 'View, update, and submit your internship assignments.'}
        actions={(
          <>
            <Button variant="outline" icon={RefreshCw} onClick={loadTasks} disabled={loading}>Refresh</Button>
            {isSuperadmin && (
              <Link to={paths.PROGRESS}>
                <Button variant="outline" icon={BarChart2}>Progress</Button>
              </Link>
            )}
            {isSuperadmin && (
              <Button variant="purple" icon={Plus}>Create Task</Button>
            )}
          </>
        )}
      />

      <div className="flex items-center justify-end">
        <div className="flex bg-white/70 border border-slate-200/60 rounded-xl p-1 shadow-sm backdrop-blur-sm">
          {['board', 'list'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                'px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all',
                view === v ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : view === 'board' ? (
        <div className="flex gap-5 overflow-x-auto pb-4">
          <KanbanColumn title="To Do" items={board.todo} count={board.todo.length} paths={paths} isStudent={isStudent} onStatusChange={handleStatusChange} accent="kanban-column-todo" />
          <KanbanColumn title="In Progress" items={board.inProgress} count={board.inProgress.length} paths={paths} isStudent={isStudent} onStatusChange={handleStatusChange} accent="kanban-column-progress" />
          <KanbanColumn title="Review" items={board.review} count={board.review.length} paths={paths} isStudent={isStudent} onStatusChange={handleStatusChange} accent="kanban-column-review" />
        </div>
      ) : (
        <Card>
          <div className="space-y-3">
            {allTasks.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No tasks assigned yet.</p>
            ) : (
              allTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  paths={paths}
                  isStudent={isStudent}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
