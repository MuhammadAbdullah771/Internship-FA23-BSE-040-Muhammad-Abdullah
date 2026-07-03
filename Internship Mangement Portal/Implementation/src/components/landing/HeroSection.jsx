import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ROUTES } from '../../constants';

const chartData = [
  { value: 92.5 },
  { value: 7.5 },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-gray-900 leading-tight tracking-tight">
              Build Skills. Get Experience.{' '}
              <span className="text-emerald-600">Land Your Job.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl">
              Stop waiting for opportunities. Start building real skills with the largest virtual
              internship platform. Your dream tech career begins here.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to={ROUTES.STUDENT.PORTAL}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:shadow-emerald-600/40"
              >
                Browse Internships
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={ROUTES.STUDENT.SIGNUP}
                className="inline-flex items-center justify-center px-7 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white hover:border-emerald-200 hover:text-emerald-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                No Experience Required
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                Industry-Ready Projects
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="absolute inset-0 bg-emerald-100 rounded-[3rem] transform rotate-3 scale-105" />
              <div className="relative rounded-[2.5rem] overflow-hidden bg-emerald-50">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop"
                  alt="Student intern with laptop"
                  className="w-full h-[420px] lg:h-[480px] object-cover object-top"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -left-4 top-8 bg-white rounded-xl shadow-lg border border-gray-100 p-3 max-w-[200px]"
              >
                <div className="flex -space-x-2 mb-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?u=student${i}`}
                      alt=""
                      className="w-7 h-7 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <p className="text-xs font-medium text-gray-700 leading-snug">
                  Join our community of <span className="text-emerald-600 font-bold">200K+</span> Students
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -left-2 bottom-16 bg-white rounded-xl shadow-lg border border-gray-100 p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Students finished courses</p>
                    <p className="text-sm font-bold text-gray-900">12,000+</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="absolute -right-2 top-12 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-[140px]"
              >
                <div className="relative h-16 w-16 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#E5E7EB" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                    92.5%
                  </span>
                </div>
                <p className="text-[10px] text-center text-gray-500 mt-1 leading-tight">
                  Internship Rate<br />Students find internships
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
