import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, Calendar, ChevronDown, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DashboardCard from '../components/common/DashboardCard';
import AreaLineChart from '../components/charts/AreaLineChart';
import DepartmentDonut from '../components/charts/DepartmentDonut';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Reports &amp; Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive insights into intern performance and program health.</p>
        </motion.div>
        <div className="flex gap-3">
          <Button variant="ghost" icon={Download} size="sm">Download PDF</Button>
          <Button variant="outline" icon={FileSpreadsheet} size="sm" className="text-primary-600 border-primary-200">
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Report Type</label>
          <button className="flex items-center justify-between w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700">
            Performance Overview <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Range</label>
          <button className="flex items-center gap-2 w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            Oct 01, 2023 - Oct 31, 2023
          </button>
        </div>
        <Button variant="purple-light" size="md">Apply Filters</Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          label="Avg Performance"
          value="8.4/10"
          change="+0.2 from last month"
          icon={TrendingUp}
          iconColor="bg-primary-50 text-primary-600"
        />
        <DashboardCard
          label="Task Completion"
          value="92%"
          subtext="45 tasks pending"
          icon={CheckCircle}
          iconColor="bg-primary-50 text-primary-600"
        >
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-primary-600 rounded-full" style={{ width: '92%' }} />
          </div>
        </DashboardCard>
        <DashboardCard
          label="Total Hours"
          value="1,240"
          subtext="Across 15 active interns"
          icon={Clock}
          iconColor="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
            <button aria-label="More options"><ChevronDown className="w-5 h-5 text-gray-400" /></button>
          </div>
          <AreaLineChart height={300} />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h2>
          <DepartmentDonut />
        </Card>
      </div>
    </div>
  );
}
