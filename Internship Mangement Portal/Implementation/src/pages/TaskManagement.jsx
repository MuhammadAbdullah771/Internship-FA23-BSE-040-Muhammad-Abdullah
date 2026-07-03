import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Paperclip, MessageSquare, BarChart2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { PRIORITY_COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchTaskBoard } from '../services/taskService';

const EMPTY_BOARD = { todo: [], inProgress: [], review: [] };

function TaskCard({ task, paths }) {
  return (
    <Link to={paths.taskDetail(task.id)}>
      <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <Badge className={`mb-2 ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</Badge>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{task.title}</h3>
        {task.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            {task.assignee ? <Avatar src={task.assignee} size="sm" /> : null}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className={task.dateUrgent ? 'text-red-500 font-medium' : ''}>{task.date}</span>
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
  );
}

function KanbanColumn({ title, items, count, paths }) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-500 flex items-center justify-center">
          {count}
        </span>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">No tasks</p>
        ) : (
          items.map((task) => <TaskCard key={task.id} task={task} paths={paths} />)
        )}
      </div>
    </div>
  );
}

export default function TaskManagement() {
  const [view, setView] = useState('board');
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [loading, setLoading] = useState(true);
  const { isSuperadmin } = useAuth();
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

  const allTasks = [...board.todo, ...board.inProgress, ...board.review];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {isSuperadmin ? 'Task Management' : 'My Tasks'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isSuperadmin ? 'Manage and track intern assignments.' : 'View and submit your internship assignments.'}
          </p>
        </motion.div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={RefreshCw} onClick={loadTasks} disabled={loading}>Refresh</Button>
          {isSuperadmin && (
            <Link to={paths.PROGRESS}>
              <Button variant="outline" icon={BarChart2}>Progress</Button>
            </Link>
          )}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['board', 'list'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                  view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {isSuperadmin && (
            <Button variant="purple" icon={Plus}>Create Task</Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : view === 'board' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn title="To Do" items={board.todo} count={board.todo.length} paths={paths} />
          <KanbanColumn title="In Progress" items={board.inProgress} count={board.inProgress.length} paths={paths} />
          <KanbanColumn title="Review" items={board.review} count={board.review.length} paths={paths} />
        </div>
      ) : (
        <Card>
          <div className="space-y-3">
            {allTasks.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No tasks assigned yet.</p>
            ) : (
              allTasks.map((task) => <TaskCard key={task.id} task={task} paths={paths} />)
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
