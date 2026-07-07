import { motion } from 'framer-motion';
import { UserPlus, BookOpen, Award } from 'lucide-react';
import { fadeUp, viewportOnce, staggerContainer, cardReveal, softHoverLift } from '../../utils/landingMotion';

const STEPS = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up, complete onboarding, and get approved to access the internship portal.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BookOpen,
    step: '02',
    title: 'Learn & Build',
    description: 'Browse tracks, apply to internships, and complete real-world tasks with mentor guidance.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Award,
    step: '03',
    title: 'Get Certified',
    description: 'Finish all assignments, earn your certificate, and showcase skills to employers.',
    color: 'from-cyan-500 to-blue-500',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="startup" className="py-20 lg:py-28 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/80 to-white pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} custom={0} className="section-label mb-3">
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Your journey in <span className="text-gradient">three simple steps</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mt-4 text-slate-500 max-w-xl mx-auto text-[15px]">
            From sign-up to certification — a structured path designed to get you job-ready.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {STEPS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={cardReveal}
                custom={i}
                whileHover={softHoverLift}
                className="relative group"
              >
                {i < STEPS.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.08 }}
                    className="hidden md:block absolute top-14 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px origin-left bg-gradient-to-r from-emerald-200 via-teal-200 to-transparent z-0"
                  />
                )}
                <div className="glass-card rounded-3xl p-8 h-full border border-slate-200/60 hover:shadow-premium-lg transition-shadow duration-300 relative z-10 overflow-hidden">
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-4xl font-black text-slate-100 group-hover:text-emerald-100 transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
