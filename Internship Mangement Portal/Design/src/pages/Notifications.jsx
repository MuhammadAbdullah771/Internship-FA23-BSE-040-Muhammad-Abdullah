import { motion } from 'framer-motion';
import { SlidersHorizontal, Clock, CheckSquare, MessageCircle, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { notifications } from '../constants/data';

const iconMap = {
  deadline: { icon: Clock, color: 'bg-red-50 text-red-500' },
  task: { icon: CheckSquare, color: 'bg-primary-50 text-primary-600' },
  feedback: { icon: MessageCircle, color: 'bg-amber-50 text-amber-600' },
  system: { icon: Info, color: 'bg-blue-50 text-blue-500' },
};

export default function Notifications() {
  const groups = [...new Set(notifications.map((n) => n.group))];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Manage alerts, tasks, and deadlines.</p>
        </motion.div>
        <div className="flex gap-3">
          <Button variant="outline" icon={SlidersHorizontal} size="sm">Filter</Button>
          <Button variant="outline" size="sm">Mark all as read</Button>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{group}</h2>
          <div className="space-y-3">
            {notifications
              .filter((n) => n.group === group)
              .map((notif) => {
                const { icon: Icon, color } = iconMap[notif.type];
                return (
                  <Card
                    key={notif.id}
                    className={`!p-4 ${notif.unread ? 'bg-primary-50/50 border-primary-100' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{notif.title}</h3>
                          <span className="text-xs text-gray-400 shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{notif.description}</p>
                        {notif.link && (
                          <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 mt-2 inline-block">
                            {notif.link}
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}

      <p className="text-center">
        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Load earlier notifications...
        </button>
      </p>
    </div>
  );
}
