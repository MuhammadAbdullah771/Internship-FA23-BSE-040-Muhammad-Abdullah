import { motion } from 'framer-motion';
import { ExternalLink, ChevronDown, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import DonutChart from '../components/charts/DonutChart';
import WeeklyBarChart from '../components/charts/WeeklyBarChart';
import { milestones } from '../constants/data';

const heatmapData = [
  [1, 2, 0, 3, 1, 2, 4],
  [0, 1, 3, 2, 4, 1, 0],
  [2, 3, 1, 0, 2, 3, 4],
  [1, 0, 2, 3, 1, 4, 2],
  [3, 2, 1, 4, 0, 1, 3],
];

const heatColors = ['#ECFDF5', '#A7F3D0', '#34D399', '#059669'];

export default function ProgressTracking() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Progress Tracking</h1>
        <p className="text-gray-500 mt-1">Monitor task completion and milestones for the engineering cohort.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Cohort Performance</h2>
            <button aria-label="External link"><ExternalLink className="w-4 h-4 text-gray-400" /></button>
          </div>
          <DonutChart value={82} size={220} label="EXCELLENT" />
          <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-400">Previous</p>
              <p className="text-lg font-bold text-gray-900">78%</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xs text-gray-400">Target</p>
              <p className="text-lg font-bold text-gray-900">90%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Task Completion Rate</h2>
              <p className="text-xs text-gray-400">Rolling 30-day view</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5">
              Last 30 Days <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <WeeklyBarChart height={220} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Cohort Milestones</h2>
            <button className="text-sm font-medium text-primary-600">View All</button>
          </div>
          <div className="space-y-4">
            {milestones.map((m) => (
              <div
                key={m.id}
                className={`flex gap-4 p-4 rounded-xl ${m.active ? 'bg-primary-50' : ''}`}
              >
                <div className="flex flex-col items-center">
                  {m.completed ? (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : m.active ? (
                    <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-sm ${m.upcoming ? 'text-gray-400' : 'text-gray-900'}`}>{m.title}</h3>
                    {m.status && (
                      <Badge variant={m.completed ? 'info' : m.active ? 'primary' : 'default'} className="text-[10px]">
                        {m.status}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs ${m.upcoming ? 'text-gray-400' : 'text-gray-500'}`}>{m.description}</p>
                  {m.date && <p className="text-xs text-gray-400 mt-1">{m.date}</p>}
                  {m.progress && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{m.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 rounded-full" style={{ width: `${m.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Activity Heatmap</h2>
              <p className="text-xs text-gray-400">Commits &amp; Task Updates</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>Less</span>
              {heatColors.map((c, i) => (
                <span key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
              <span>More</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col justify-between text-xs text-gray-400 py-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-400 mb-2 px-1">
                <span>Sep</span>
                <span>Oct</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {heatmapData.flat().map((level, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md"
                    style={{ backgroundColor: heatColors[level] }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
