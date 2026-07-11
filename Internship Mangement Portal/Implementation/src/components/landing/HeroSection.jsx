import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, BookOpen, Sparkles } from 'lucide-react';
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
      <div className="absolute top-16 right-0 w-[480px] h-[480px] bg-emerald-400/12 rounded-full blur-[90px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-teal-400/10 rounded-full blur-[70px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="landing-container relative py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-200/70 shadow-sm backdrop-blur-sm mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs sm:text-sm font-semibold text-emerald-700">
                Pakistan&apos;s #1 Virtual Internship Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-[2rem] sm:text-4xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.12] tracking-tight"
            >
              Build Skills. Get Experience.{' '}
              <span className="text-gradient">Land Your Job.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-[15px] sm:text-base text-slate-500 leading-relaxed"
            >
              Stop waiting for opportunities. Start building real skills with structured
              internship tracks designed to get you job-ready.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <motion.div whileHover={softHoverLift} whileTap={softTap}>
                <a
                  href="#internships"
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 btn-shine"
                >
                  Browse Internships
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.div>
              <motion.div whileHover={softHoverLift} whileTap={softTap}>
                <Link
                  to={ROUTES.STUDENT.LOGIN}
                  className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3.5 border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 text-sm font-bold rounded-xl hover:bg-white hover:border-emerald-300/70 hover:text-emerald-700 transition-all duration-300 shadow-sm"
                >
                  Join Internship Portal
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerContainerFast}
              custom={4}
              className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-x-5 sm:gap-y-2"
            >
              {TRUST_ITEMS.map((item) => (
                <motion.div
                  key={item}
                  variants={fadeUp}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
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
            <motion.div variants={heroCluster} className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/50 to-teal-200/30 rounded-[2rem] scale-[1.03] rotate-2" />
              <div className="relative rounded-[1.75rem] overflow-hidden ring-4 ring-white shadow-premium-lg">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop"
                  alt="Student intern with laptop"
                  className="w-full h-[360px] sm:h-[400px] lg:h-[440px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/15 via-transparent to-transparent" />
              </div>

              <motion.div
                {...floatY}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
                transition={{
                  opacity: { delay: 0.5 },
                  x: { delay: 0.5, duration: 0.45 },
                  y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                }}
                className="absolute -left-2 sm:-left-5 top-8 glass-card rounded-2xl p-3.5 max-w-[190px] shadow-premium"
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
                <p className="text-xs font-semibold text-slate-700 leading-snug">
                  Join <span className="text-gradient font-extrabold">200K+</span> students
                </p>
              </motion.div>

              <motion.div
                {...floatYDelayed(1)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [0, -6, 0] }}
                transition={{
                  opacity: { delay: 0.7 },
                  y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                }}
                className="absolute -left-1 sm:-left-3 bottom-16 glass-card rounded-2xl p-3 shadow-premium"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <BookOpen className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium leading-none">Completed</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">12,000+</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...floatYDelayed(2)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [0, -6, 0] }}
                transition={{
                  opacity: { delay: 0.85 },
                  y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
                }}
                className="absolute -right-2 sm:-right-4 top-12 glass-card rounded-2xl p-3.5 w-[132px] shadow-premium"
              >
                <div className="relative h-14 w-14 mx-auto">
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
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-900">
                    92.5%
                  </span>
                </div>
                <p className="text-[10px] text-center text-slate-500 mt-1.5 font-medium leading-tight">
                  Placement rate
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
