import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, BookOpen, Sparkles, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ROUTES } from '../../constants';
import {
  staggerContainer,
  staggerContainerFast,
  fadeUp,
  slideInRight,
  floatY,
  floatYDelayed,
  heroCluster,
  softHoverLift,
  softTap,
} from '../../utils/landingMotion';

const chartData = [{ value: 92.5 }, { value: 7.5 }];

const TRUST_ITEMS = ['No Experience Required', 'Industry-Ready Projects', 'Mentor-Led Tracks'];

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-emerald-400/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-emerald-200/60 shadow-sm backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Pakistan&apos;s #1 Virtual Internship Platform</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight"
            >
              Build Skills. Get Experience.{' '}
              <span className="text-gradient">Land Your Job.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl"
            >
              Stop waiting for opportunities. Start building real skills with the largest virtual
              internship platform. Your dream tech career begins here.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={softHoverLift} whileTap={softTap}>
                <Link
                to={ROUTES.STUDENT.PORTAL}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 btn-shine"
                >
                  Browse Internships
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={softHoverLift} whileTap={softTap}>
                <Link
                to={ROUTES.STUDENT.LOGIN}
                className="inline-flex items-center justify-center px-7 py-4 border border-slate-200/80 bg-white/70 backdrop-blur-sm text-slate-700 font-bold rounded-2xl hover:bg-white hover:border-emerald-300/60 hover:text-emerald-700 transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                >
                  Join Internship Portal
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerContainerFast}
              custom={4}
              className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6"
            >
              {TRUST_ITEMS.map((item) => (
                <motion.div
                  key={item}
                  variants={fadeUp}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </span>
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div variants={heroCluster} className="relative w-full max-w-md lg:max-w-lg">
              <motion.div
                animate={{ rotate: [3, 5, 3] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-br from-emerald-200/60 to-teal-200/40 rounded-[3rem] transform scale-105"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-[2.5rem] overflow-hidden ring-4 ring-white shadow-premium-lg"
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop"
                  alt="Student intern with laptop"
                  className="w-full h-[420px] lg:h-[500px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-transparent" />
              </motion.div>

              <motion.div
                {...floatY}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                transition={{ opacity: { delay: 0.6 }, x: { delay: 0.6, duration: 0.5 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } }}
                whileHover={{ scale: 1.03, x: 4 }}
                className="absolute -left-2 sm:-left-6 top-10 glass-card rounded-2xl p-4 max-w-[210px] shadow-premium-lg"
              >
                <div className="flex -space-x-2 mb-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.img
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 300 }}
                      src={`https://i.pravatar.cc/40?u=student${i}`}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-100"
                    />
                  ))}
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-snug">
                  Join <span className="text-gradient font-extrabold">200K+</span> students worldwide
                </p>
              </motion.div>

              <motion.div
                {...floatYDelayed(1)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{ opacity: { delay: 0.9 }, y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 } }}
                whileHover={{ scale: 1.03, x: 2 }}
                className="absolute -left-1 sm:-left-4 bottom-20 glass-card rounded-2xl p-3.5 shadow-premium-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/25">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Courses completed</p>
                    <p className="text-base font-extrabold text-slate-900">12,000+</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...floatYDelayed(2)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{ opacity: { delay: 1.1 }, y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 } }}
                whileHover={{ scale: 1.03, x: -2 }}
                className="absolute -right-2 sm:-right-4 top-14 glass-card rounded-2xl p-4 w-[150px] shadow-premium-lg"
              >
                <div className="relative h-[72px] w-[72px] mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="68%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-slate-900">
                    92.5%
                  </span>
                </div>
                <p className="text-[10px] text-center text-slate-500 mt-2 font-medium leading-tight">
                  Placement rate for graduates
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="absolute right-8 bottom-8 flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-lg"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-slate-700">Live cohorts open</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
