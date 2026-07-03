import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Paperclip, MessageSquare } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';

export default function TaskDetails() {
  const { user, isStudent } = useAuth();
  const paths = useAppPaths();

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to={paths.TASKS} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="danger">High Priority</Badge>
              <Badge variant="primary">In Progress</Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Client Presentation Slides</h1>
            <p className="text-gray-500 mt-1">Frontend Development</p>
          </div>
          {isStudent && (
            <Link to={paths.TASK_SUBMIT}>
              <Button variant="purple">Submit Task</Button>
            </Link>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Create a comprehensive presentation deck for the upcoming client review meeting. The deck should include project progress, key milestones achieved, upcoming deliverables, and risk assessment. Ensure all slides follow the company brand guidelines.
            </p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">&#8226;</span>Minimum 15 slides covering all project phases</li>
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">&#8226;</span>Include data visualizations for key metrics</li>
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">&#8226;</span>Follow brand guidelines for colors and typography</li>
              <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">&#8226;</span>Submit in both PPTX and PDF formats</li>
            </ul>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Assignee</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                    <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className="text-sm font-medium text-red-500">Tomorrow</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Paperclip className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Attachments</p>
                  <p className="text-sm font-medium text-gray-900">0 files</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Comments</p>
                  <p className="text-sm font-medium text-gray-900">12 comments</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
